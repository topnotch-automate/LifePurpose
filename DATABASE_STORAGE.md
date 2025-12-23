# Database Storage with File System Fallback

This document explains the storage system for likes and comments, which supports both database and file system storage with automatic fallback.

## Overview

The storage system uses a **fallback strategy**:
1. **Primary**: Database (PostgreSQL via Vercel Postgres)
2. **Fallback**: File system (`/tmp` in production, `data/` in development)

If the database is unavailable or not configured, the system automatically falls back to file system storage, ensuring your app always works.

## Architecture

### Storage Abstraction (`lib/storage.ts`)

The `StorageManager` class provides a unified interface:
- `getLikes()`: Get all like counts
- `saveLikes(likes)`: Save like counts
- `getComments()`: Get all comments
- `saveComments(comments)`: Save all comments

Internally, it:
1. Checks if database is available
2. Tries database first (if available)
3. Falls back to file system on any error

### Current Implementation

- **File System Storage**: Always available
- **Database Storage**: Only used if `POSTGRES_URL` environment variable is set

## Setup

### Option 1: File System Only (Default)

No setup required! The system works out of the box using file system storage.

**Local Development:**
- Data stored in `author-platform/data/`
- Files: `likes.json`, `comments.json`
- ✅ Persistent across restarts

**Production (Vercel):**
- Data stored in `/tmp/`
- ⚠️ **Temporary** - data is lost on deployment/restart

### Option 2: Database (Recommended for Production)

To enable database storage:

1. **Set up Vercel Postgres:**
   - Go to your Vercel project dashboard
   - Navigate to Storage → Create Database → Postgres
   - Copy the `POSTGRES_URL` connection string

2. **Install the dependency:**
   ```bash
   npm install @vercel/postgres
   ```

3. **Add environment variable:**
   - **Local Development**: Add to `.env.local`:
     ```
     POSTGRES_URL=your_postgres_connection_string
     ```
   - **Production**: Add to Vercel environment variables

4. **Tables are created automatically:**
   - On first use, the system creates `likes` and `comments` tables
   - No manual setup required

## How It Works

### Database Detection

The system checks for database availability by:
1. Looking for `POSTGRES_URL` environment variable
2. Attempting to initialize database connection
3. Creating tables if they don't exist

If any step fails, it falls back to file system silently.

### Storage Priority

```typescript
// Pseudo-code of the logic
async getLikes() {
  if (database.isAvailable()) {
    try {
      return await database.getLikes();
    } catch (error) {
      console.warn("Database failed, using file system");
      return await fileSystem.getLikes();
    }
  }
  return await fileSystem.getLikes();
}
```

### Error Handling

- **Database connection errors**: Logged as warnings, fallback to file system
- **Database query errors**: Logged as warnings, fallback to file system
- **File system errors**: Thrown (should not happen in normal operation)

## Migration

### From File System to Database

1. Set up database (see Option 2 above)
2. Deploy with `POSTGRES_URL` set
3. The system will start using the database for new writes
4. **Note**: Existing file system data is not automatically migrated

### Manual Data Migration (if needed)

If you want to migrate existing file system data to database:

```bash
# 1. Read existing data
# 2. Use the storage API to save it
# 3. The system will save to database if available
```

Or write a migration script that:
1. Reads from file system
2. Uses `storage.saveLikes()` and `storage.saveComments()`
3. The storage manager will write to database if available

## Database Schema

### `likes` Table

```sql
CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

- `key`: Format `{type}-{id}` (e.g., `article-consciousness`)
- `count`: Number of likes

### `comments` Table

```sql
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
);
```

- `id`: Unique comment ID (format: `{timestamp}-{random}`)
- `parent_id`: For replies, references the parent comment ID
- `type`: Content type (e.g., `article`, `video`)
- `content_id`: The slug/ID of the content piece

## Performance Considerations

### Current Implementation

- **File System**: Fast for small datasets, limited by disk I/O
- **Database**: Uses transactions for atomicity
- **Save Comments**: Currently deletes all and re-inserts (simple but not optimal for large datasets)

### Future Optimizations

For high-traffic scenarios, consider:
1. **Incremental Updates**: Only save changed comments instead of all comments
2. **Caching**: Add Redis cache layer
3. **Connection Pooling**: Configure proper connection pooling
4. **Indexing**: Add indexes on frequently queried columns

## Testing

### Test Database Availability

The system automatically detects database availability. To test:

1. **With database configured**: Should use database
2. **Without database configured**: Should use file system
3. **Database connection fails**: Should fall back to file system

### Local Testing

```bash
# Test with file system (default)
npm run dev

# Test with database
# Set POSTGRES_URL in .env.local
npm run dev
```

## Troubleshooting

### Database Not Being Used

1. Check `POSTGRES_URL` is set in environment variables
2. Check database connection string is valid
3. Check console logs for initialization errors
4. Verify `@vercel/postgres` is installed

### Data Loss

- **File System**: Data in `/tmp` is temporary in Vercel (expected)
- **Database**: Data should persist, check database connection
- **Migration**: Old file system data is not automatically migrated

### Performance Issues

- **Large comment counts**: Consider optimizing `saveComments` to use incremental updates
- **Database queries**: Add indexes on `type`, `content_id`, `parent_id` columns

## Summary

✅ **Always Works**: Falls back to file system if database unavailable  
✅ **Zero Configuration**: Works out of the box  
✅ **Easy Migration**: Just set `POSTGRES_URL` to enable database  
✅ **Production Ready**: Database provides persistent storage in production  

The system is designed to be **resilient** - your app will always function, whether database is available or not.

