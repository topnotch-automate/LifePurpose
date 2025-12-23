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

// Storage adapter interface
interface StorageAdapter {
  getLikes(): Promise<Record<string, number>>;
  saveLikes(likes: Record<string, number>): Promise<void>;
  getComments(): Promise<CommentRecord[]>;
  saveComments(comments: CommentRecord[]): Promise<void>;
  isAvailable(): Promise<boolean>;
}

// File system storage adapter (fallback)
class FileSystemStorage implements StorageAdapter {
  private likesPath: string;
  private commentsPath: string;

  constructor() {
    const isVercel = process.env.VERCEL;
    const baseDir = isVercel ? "/tmp" : path.join(process.cwd(), "data");
    
    this.likesPath = path.join(baseDir, "likes.json");
    this.commentsPath = path.join(baseDir, "comments.json");
    
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
}

// Database storage adapter (PostgreSQL via @vercel/postgres)
class DatabaseStorage implements StorageAdapter {
  private db: any = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // Will be initialized lazily when needed
  }

  private async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      if (this.initialized) return;

      try {
        // Only try Vercel Postgres if POSTGRES_URL is set
        // Note: @vercel/postgres must be installed if using database storage
        // If not installed, this will fail gracefully and use file system fallback
        if (process.env.POSTGRES_URL) {
          const { sql } = await import("@vercel/postgres");
          this.db = sql;
          
          // Initialize tables if they don't exist (with error handling)
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
            
            this.initialized = true;
            console.log("DatabaseStorage: Initialized with PostgreSQL");
          } catch (tableError) {
            console.warn("DatabaseStorage: Table creation failed, will use fallback:", tableError);
            this.initialized = false;
          }
          return;
        }

        // No database configured
        this.initialized = false;
      } catch (error) {
        console.warn("DatabaseStorage: Initialization failed, will use fallback:", error);
        this.initialized = false;
      }
    })();

    return this.initPromise;
  }

  async isAvailable(): Promise<boolean> {
    await this.initialize();
    return this.initialized && this.db !== null && !!process.env.POSTGRES_URL;
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
    } catch (error) {
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
}

// Export singleton instance
export const storage = new StorageManager();

