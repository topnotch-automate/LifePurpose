/**
 * Storage abstraction with database fallback to file system
 * 
 * Priority:
 * 1. Database (if configured and available)
 * 2. File system (/tmp in production, data/ in dev)
 * 
 * This ensures the app always works, even if database is unavailable.
 */

import fs from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import { createPostgresSql } from "@/lib/postgres";

// Storage interfaces
export interface CommentRecord {
  id: string;
  author: string;
  content: string;
  date: string;
  type: string;
  contentId: string;
  parentId?: string;
  authorLiked?: boolean;
}

export interface SubscriberRecord {
  id: string;
  email: string;
  source: string;
  pageUrl?: string;
  /** Admin marked as manually added to Substack */
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertSubscriberInput {
  email: string;
  source: string;
  pageUrl?: string;
}

// Storage adapter interface
interface StorageAdapter {
  getLikes(): Promise<Record<string, number>>;
  saveLikes(likes: Record<string, number>): Promise<void>;
  getComments(): Promise<CommentRecord[]>;
  saveComments(comments: CommentRecord[]): Promise<void>;
  getSubscribers(): Promise<SubscriberRecord[]>;
  upsertSubscriber(input: UpsertSubscriberInput): Promise<SubscriberRecord>;
  updateSubscriber(id: string, updates: { synced?: boolean }): Promise<SubscriberRecord | null>;
  deleteSubscriber(id: string): Promise<boolean>;
  isAvailable(): Promise<boolean>;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// File system storage adapter (fallback)
class FileSystemStorage implements StorageAdapter {
  private likesPath: string;
  private commentsPath: string;
  private subscribersPath: string;

  constructor() {
    const isVercel = process.env.VERCEL;
    const baseDir = isVercel ? "/tmp" : path.join(process.cwd(), "data");
    
    this.likesPath = path.join(baseDir, "likes.json");
    this.commentsPath = path.join(baseDir, "comments.json");
    this.subscribersPath = path.join(baseDir, "subscribers.json");
    
    // Ensure directory exists
    const dir = path.dirname(this.likesPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async isAvailable(): Promise<boolean> {
    return true; // File system is always available
  }

  async getLikes(): Promise<Record<string, number>> {
    try {
      if (!fs.existsSync(this.likesPath)) {
        return {};
      }
      const data = fs.readFileSync(this.likesPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.warn("FileSystemStorage: Error reading likes:", error);
      return {};
    }
  }

  async saveLikes(likes: Record<string, number>): Promise<void> {
    try {
      fs.writeFileSync(this.likesPath, JSON.stringify(likes, null, 2), "utf8");
    } catch (error) {
      console.error("FileSystemStorage: Error saving likes:", error);
      throw error;
    }
  }

  async getComments(): Promise<CommentRecord[]> {
    try {
      if (!fs.existsSync(this.commentsPath)) {
        return [];
      }
      const data = fs.readFileSync(this.commentsPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.warn("FileSystemStorage: Error reading comments:", error);
      return [];
    }
  }

  async saveComments(comments: CommentRecord[]): Promise<void> {
    try {
      fs.writeFileSync(this.commentsPath, JSON.stringify(comments, null, 2), "utf8");
    } catch (error) {
      console.error("FileSystemStorage: Error saving comments:", error);
      throw error;
    }
  }

  private readSubscribers(): SubscriberRecord[] {
    try {
      if (!fs.existsSync(this.subscribersPath)) {
        return [];
      }
      const data = fs.readFileSync(this.subscribersPath, "utf8");
      return JSON.parse(data) as SubscriberRecord[];
    } catch (error) {
      console.warn("FileSystemStorage: Error reading subscribers:", error);
      return [];
    }
  }

  private writeSubscribers(subscribers: SubscriberRecord[]): void {
    fs.writeFileSync(this.subscribersPath, JSON.stringify(subscribers, null, 2), "utf8");
  }

  async getSubscribers(): Promise<SubscriberRecord[]> {
    return this.readSubscribers().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async upsertSubscriber(input: UpsertSubscriberInput): Promise<SubscriberRecord> {
    const email = normalizeEmail(input.email);
    if (!isValidEmail(email)) {
      throw new Error("Invalid email");
    }

    const now = new Date().toISOString();
    const subscribers = this.readSubscribers();
    const existing = subscribers.find((s) => s.email === email);

    if (existing) {
      existing.source = input.source.trim() || existing.source;
      existing.pageUrl = input.pageUrl?.trim() || existing.pageUrl;
      existing.updatedAt = now;
      this.writeSubscribers(subscribers);
      return existing;
    }

    const record: SubscriberRecord = {
      id: randomUUID(),
      email,
      source: input.source.trim() || "website",
      pageUrl: input.pageUrl?.trim(),
      synced: false,
      createdAt: now,
      updatedAt: now,
    };
    subscribers.push(record);
    this.writeSubscribers(subscribers);
    return record;
  }

  async updateSubscriber(
    id: string,
    updates: { synced?: boolean }
  ): Promise<SubscriberRecord | null> {
    const subscribers = this.readSubscribers();
    const index = subscribers.findIndex((s) => s.id === id);
    if (index === -1) return null;

    if (typeof updates.synced === "boolean") {
      subscribers[index].synced = updates.synced;
    }
    subscribers[index].updatedAt = new Date().toISOString();
    this.writeSubscribers(subscribers);
    return subscribers[index];
  }

  async deleteSubscriber(id: string): Promise<boolean> {
    const subscribers = this.readSubscribers();
    const filtered = subscribers.filter((s) => s.id !== id);
    if (filtered.length === subscribers.length) return false;
    this.writeSubscribers(filtered);
    return true;
  }
}

// Database storage adapter (PostgreSQL via @vercel/postgres)
class DatabaseStorage implements StorageAdapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private db: any = null;
  private initialized = false;
  private initFailed = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // Will be initialized lazily when needed
  }

  private async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      if (this.initialized || this.initFailed) return;

      try {
        const sql = await createPostgresSql();
        if (!sql) {
          this.initialized = false;
          return;
        }

        this.db = sql;

        try {
          await this.db`
            CREATE TABLE IF NOT EXISTS likes (
              id SERIAL PRIMARY KEY,
              key VARCHAR(255) UNIQUE NOT NULL,
              count INTEGER NOT NULL DEFAULT 0,
              updated_at TIMESTAMP DEFAULT NOW()
            )
          `;

          await this.db`
            CREATE TABLE IF NOT EXISTS comments (
              id VARCHAR(255) PRIMARY KEY,
              author VARCHAR(255) NOT NULL,
              content TEXT NOT NULL,
              date TIMESTAMP NOT NULL,
              type VARCHAR(50) NOT NULL,
              content_id VARCHAR(255) NOT NULL,
              parent_id VARCHAR(255),
              author_liked BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP DEFAULT NOW()
            )
          `;

          await this.db`
            CREATE TABLE IF NOT EXISTS email_subscribers (
              id VARCHAR(255) PRIMARY KEY,
              email VARCHAR(255) UNIQUE NOT NULL,
              source VARCHAR(255) NOT NULL DEFAULT 'website',
              page_url TEXT,
              synced BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            )
          `;

          this.initialized = true;
          console.log("DatabaseStorage: Initialized with PostgreSQL");
        } catch (tableError) {
          console.warn("DatabaseStorage: Table creation failed, will use fallback:", tableError);
          this.db = null;
          this.initialized = false;
          this.initFailed = true;
        }
      } catch (error) {
        console.warn("DatabaseStorage: Initialization failed, will use fallback:", error);
        this.initialized = false;
        this.initFailed = true;
      }
    })();

    return this.initPromise;
  }

  async isAvailable(): Promise<boolean> {
    await this.initialize();
    return this.initialized && this.db !== null;
  }

  async getLikes(): Promise<Record<string, number>> {
    if (!(await this.isAvailable())) {
      throw new Error("Database not available");
    }

    try {
      const rows = await this.db`
        SELECT key, count FROM likes
      `;
      const likes: Record<string, number> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rows.forEach((row: any) => {
        likes[row.key] = row.count;
      });
      return likes;
    } catch (error) {
      console.error("DatabaseStorage: Error getting likes:", error);
      throw error;
    }
  }

  async saveLikes(likes: Record<string, number>): Promise<void> {
    if (!(await this.isAvailable())) {
      throw new Error("Database not available");
    }

    try {
      // Upsert each like count
      for (const [key, count] of Object.entries(likes)) {
        await this.db`
          INSERT INTO likes (key, count, updated_at)
          VALUES (${key}, ${count}, NOW())
          ON CONFLICT (key) 
          DO UPDATE SET count = ${count}, updated_at = NOW()
        `;
      }
    } catch (error) {
      console.error("DatabaseStorage: Error saving likes:", error);
      throw error;
    }
  }

  async getComments(): Promise<CommentRecord[]> {
    if (!(await this.isAvailable())) {
      throw new Error("Database not available");
    }

    try {
      const rows = await this.db`
        SELECT id, author, content, date, type, content_id, parent_id, author_liked
        FROM comments
        ORDER BY date DESC
      `;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return rows.map((row: any) => ({
        id: row.id,
        author: row.author,
        content: row.content,
        date: row.date instanceof Date ? row.date.toISOString() : row.date,
        type: row.type,
        contentId: row.content_id,
        parentId: row.parent_id,
        authorLiked: row.author_liked,
      }));
    } catch (error) {
      console.error("DatabaseStorage: Error getting comments:", error);
      throw error;
    }
  }

  async saveComments(comments: CommentRecord[]): Promise<void> {
    if (!(await this.isAvailable())) {
      throw new Error("Database not available");
    }

    try {
      // Delete all comments first
      await this.db`DELETE FROM comments`;
      
      // Insert all comments
      if (comments.length > 0) {
        // Insert comments one by one
        // Note: For better performance with many comments, consider batch inserts or UPSERT logic
        for (const comment of comments) {
          await this.db`
            INSERT INTO comments (id, author, content, date, type, content_id, parent_id, author_liked)
            VALUES (
              ${comment.id},
              ${comment.author},
              ${comment.content},
              ${comment.date},
              ${comment.type},
              ${comment.contentId},
              ${comment.parentId || null},
              ${comment.authorLiked || false}
            )
          `;
        }
      }
    } catch (error) {
      console.error("DatabaseStorage: Error saving comments:", error);
      throw error;
    }
  }

  async getSubscribers(): Promise<SubscriberRecord[]> {
    if (!(await this.isAvailable())) {
      throw new Error("Database not available");
    }

    try {
      const rows = await this.db`
        SELECT id, email, source, page_url, synced, created_at, updated_at
        FROM email_subscribers
        ORDER BY updated_at DESC
      `;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return rows.map((row: any) => ({
        id: row.id,
        email: row.email,
        source: row.source,
        pageUrl: row.page_url || undefined,
        synced: Boolean(row.synced),
        createdAt:
          row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
        updatedAt:
          row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
      }));
    } catch (error) {
      console.error("DatabaseStorage: Error getting subscribers:", error);
      throw error;
    }
  }

  async upsertSubscriber(input: UpsertSubscriberInput): Promise<SubscriberRecord> {
    if (!(await this.isAvailable())) {
      throw new Error("Database not available");
    }

    const email = normalizeEmail(input.email);
    if (!isValidEmail(email)) {
      throw new Error("Invalid email");
    }

    const source = input.source.trim() || "website";
    const pageUrl = input.pageUrl?.trim() || null;
    const id = randomUUID();

    try {
      const rows = await this.db`
        INSERT INTO email_subscribers (id, email, source, page_url, synced, created_at, updated_at)
        VALUES (${id}, ${email}, ${source}, ${pageUrl}, FALSE, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET
          source = EXCLUDED.source,
          page_url = COALESCE(EXCLUDED.page_url, email_subscribers.page_url),
          updated_at = NOW()
        RETURNING id, email, source, page_url, synced, created_at, updated_at
      `;
      const row = rows[0];
      return {
        id: row.id,
        email: row.email,
        source: row.source,
        pageUrl: row.page_url || undefined,
        synced: Boolean(row.synced),
        createdAt:
          row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
        updatedAt:
          row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
      };
    } catch (error) {
      console.error("DatabaseStorage: Error upserting subscriber:", error);
      throw error;
    }
  }

  async updateSubscriber(
    id: string,
    updates: { synced?: boolean }
  ): Promise<SubscriberRecord | null> {
    if (!(await this.isAvailable())) {
      throw new Error("Database not available");
    }

    if (typeof updates.synced !== "boolean") {
      return null;
    }

    try {
      const rows = await this.db`
        UPDATE email_subscribers
        SET synced = ${updates.synced}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, email, source, page_url, synced, created_at, updated_at
      `;
      if (!rows.length) return null;
      const row = rows[0];
      return {
        id: row.id,
        email: row.email,
        source: row.source,
        pageUrl: row.page_url || undefined,
        synced: Boolean(row.synced),
        createdAt:
          row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
        updatedAt:
          row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
      };
    } catch (error) {
      console.error("DatabaseStorage: Error updating subscriber:", error);
      throw error;
    }
  }

  async deleteSubscriber(id: string): Promise<boolean> {
    if (!(await this.isAvailable())) {
      throw new Error("Database not available");
    }

    try {
      const rows = await this.db`
        DELETE FROM email_subscribers WHERE id = ${id} RETURNING id
      `;
      return rows.length > 0;
    } catch (error) {
      console.error("DatabaseStorage: Error deleting subscriber:", error);
      throw error;
    }
  }
}

// Main storage manager with fallback
class StorageManager {
  private dbStorage: DatabaseStorage;
  private fileStorage: FileSystemStorage;
  private useDatabase: boolean = false;

  constructor() {
    this.dbStorage = new DatabaseStorage();
    this.fileStorage = new FileSystemStorage();
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      const available = await this.dbStorage.isAvailable();
      this.useDatabase = available;
      return available;
    } catch {
      this.useDatabase = false;
      return false;
    }
  }

  async getLikes(): Promise<Record<string, number>> {
    const useDb = await this.checkDatabase();
    if (useDb) {
      try {
        return await this.dbStorage.getLikes();
      } catch (error) {
        console.warn("Database getLikes failed, falling back to file system:", error);
        return await this.fileStorage.getLikes();
      }
    }
    return await this.fileStorage.getLikes();
  }

  async saveLikes(likes: Record<string, number>): Promise<void> {
    const useDb = await this.checkDatabase();
    if (useDb) {
      try {
        await this.dbStorage.saveLikes(likes);
        return; // Don't save to file if DB succeeds
      } catch (error) {
        console.warn("Database saveLikes failed, falling back to file system:", error);
      }
    }
    await this.fileStorage.saveLikes(likes);
  }

  async getComments(): Promise<CommentRecord[]> {
    const useDb = await this.checkDatabase();
    if (useDb) {
      try {
        return await this.dbStorage.getComments();
      } catch (error) {
        console.warn("Database getComments failed, falling back to file system:", error);
        return await this.fileStorage.getComments();
      }
    }
    return await this.fileStorage.getComments();
  }

  async saveComments(comments: CommentRecord[]): Promise<void> {
    const useDb = await this.checkDatabase();
    if (useDb) {
      try {
        await this.dbStorage.saveComments(comments);
        return; // Don't save to file if DB succeeds
      } catch (error) {
        console.warn("Database saveComments failed, falling back to file system:", error);
      }
    }
    await this.fileStorage.saveComments(comments);
  }

  async getSubscribers(): Promise<SubscriberRecord[]> {
    const useDb = await this.checkDatabase();
    if (useDb) {
      try {
        return await this.dbStorage.getSubscribers();
      } catch (error) {
        console.warn("Database getSubscribers failed, falling back to file system:", error);
        return await this.fileStorage.getSubscribers();
      }
    }
    return await this.fileStorage.getSubscribers();
  }

  async upsertSubscriber(input: UpsertSubscriberInput): Promise<SubscriberRecord> {
    const useDb = await this.checkDatabase();
    if (useDb) {
      try {
        return await this.dbStorage.upsertSubscriber(input);
      } catch (error) {
        console.warn("Database upsertSubscriber failed, falling back to file system:", error);
      }
    }
    return await this.fileStorage.upsertSubscriber(input);
  }

  async updateSubscriber(
    id: string,
    updates: { synced?: boolean }
  ): Promise<SubscriberRecord | null> {
    const useDb = await this.checkDatabase();
    if (useDb) {
      try {
        return await this.dbStorage.updateSubscriber(id, updates);
      } catch (error) {
        console.warn("Database updateSubscriber failed, falling back to file system:", error);
      }
    }
    return await this.fileStorage.updateSubscriber(id, updates);
  }

  async deleteSubscriber(id: string): Promise<boolean> {
    const useDb = await this.checkDatabase();
    if (useDb) {
      try {
        return await this.dbStorage.deleteSubscriber(id);
      } catch (error) {
        console.warn("Database deleteSubscriber failed, falling back to file system:", error);
      }
    }
    return await this.fileStorage.deleteSubscriber(id);
  }
}

// Export singleton instance
export const storage = new StorageManager();

