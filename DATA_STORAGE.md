# Data Storage: Likes and Comments

> **Update**: This document describes the legacy file-only implementation. For the current implementation with database fallback support, see **[DATABASE_STORAGE.md](./DATABASE_STORAGE.md)**.

## Legacy Implementation (File System Only)

### Storage Mechanism

**Likes and comments are stored in JSON files:**

- **Local Development:** `data/likes.json` and `data/comments.json`
- **Production (Vercel):** `/tmp/likes.json` and `/tmp/comments.json`

### Storage Details

#### Local Development
- **Location:** `author-platform/data/`
- **Persistence:** ✅ **Permanent** (until manually deleted)
- **Git:** Excluded via `.gitignore`
- **Structure:**
  - `likes.json`: `{ "article-slug": count, ... }`
  - `comments.json`: Array of comment objects

#### Production (Vercel/Serverless)
- **Location:** `/tmp/` directory
- **Persistence:** ❌ **TEMPORARY** (ephemeral storage)
- **Why temporary:**
  - Vercel uses serverless functions
  - `/tmp` is cleared between function invocations
  - Data is **lost on deployment** or function restart
  - Not shared between function instances

## Critical Limitation

⚠️ **Important:** In production, likes and comments are **NOT permanently stored**. They will be lost when:
- The serverless function restarts
- You deploy a new version
- The function instance is recycled
- After a period of inactivity

This is a **significant limitation** for production use.

## Current Code Behavior

The code attempts to handle both environments:

```typescript
const dataPath = process.env.VERCEL 
  ? path.join("/tmp", "data.json")      // Temporary in production
  : path.join(process.cwd(), "data", "data.json");  // Permanent in dev
```

However, `/tmp` in serverless is not a reliable persistent storage solution.

## Recommended Solutions

### Option 1: Database (Recommended for Production)

**Use a proper database:**
- **PostgreSQL** (via Vercel Postgres, Supabase, or Railway)
- **MongoDB** (via MongoDB Atlas)
- **SQLite** (for simpler setups, but needs persistent volume)

**Benefits:**
- ✅ Truly permanent storage
- ✅ Scalable
- ✅ ACID transactions
- ✅ Query capabilities

### Option 2: External Storage Service

**Use cloud storage:**
- **Vercel KV** (Redis-based key-value store)
- **Upstash Redis**
- **Cloudflare D1** (SQLite-based)

**Benefits:**
- ✅ Persistent across deployments
- ✅ Fast (Redis)
- ✅ Serverless-friendly

### Option 3: Headless CMS/Comment System

**Use a service:**
- **Disqus**
- **Giscus** (GitHub Discussions)
- **Utterances** (GitHub Issues)
- **Clerk** or **Supabase Auth** + custom comments

**Benefits:**
- ✅ No backend management
- ✅ Built-in moderation
- ✅ User authentication handled

## Migration Path

If you want to migrate to persistent storage:

1. **Choose a storage solution** (database or service)
2. **Update API routes** (`app/api/likes/route.ts`, `app/api/comments/route.ts`)
3. **Create migration script** to move existing data (if any)
4. **Update environment variables** for connection strings

## Current State Summary

| Aspect | Local Dev | Production (Vercel) |
|--------|-----------|---------------------|
| **Storage Type** | JSON files | JSON files in `/tmp` |
| **Persistence** | ✅ Permanent | ❌ Temporary |
| **Survives Deploy** | ✅ Yes | ❌ No |
| **Survives Restart** | ✅ Yes | ❌ No |
| **Suitable for Production** | ⚠️ Development only | ❌ Not recommended |

## Recommendation

For a production author platform, you should migrate to a proper database. The current file-based approach is fine for:
- ✅ Local development
- ✅ Testing
- ✅ Proof of concept

But **not suitable** for production where you want to:
- Keep user engagement (likes, comments)
- Build an audience
- Track content performance

Consider migrating to **Vercel Postgres** or **Supabase** for a straightforward, serverless-friendly database solution.

