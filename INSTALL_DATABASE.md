# Installing Vercel Postgres

## Step 1: Install the Package

Run one of these commands in your project root:

```bash
npm install @vercel/postgres
```

or if you're using yarn:

```bash
yarn add @vercel/postgres
```

or if you're using pnpm:

```bash
pnpm add @vercel/postgres
```

## Step 2: Set Up Vercel Postgres Database

### Option A: In Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Follow the setup wizard
6. Copy the `POSTGRES_URL` connection string (it will be automatically added to your environment variables)

### Option B: Using Vercel CLI

```bash
vercel env add POSTGRES_URL
```

Then paste your Postgres connection string when prompted.

## Step 3: Set Environment Variables

### Local Development

Create or update `.env.local` in your project root:

```env
POSTGRES_URL=your_postgres_connection_string_here
```

**Important:** Never commit `.env.local` to git (it should already be in `.gitignore`).

### Production

If you set up the database through Vercel dashboard, the `POSTGRES_URL` is automatically added to your environment variables. Otherwise, add it manually in your Vercel project settings.

## Step 4: Verify Installation

After installing the package and setting up the database:

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Check the console logs:**
   - If the database connects successfully, you'll see: `"DatabaseStorage: Initialized with PostgreSQL"`
   - If it falls back to file system, you'll see: `"DatabaseStorage: @vercel/postgres not available, will use file system fallback"`

## Step 5: Test Database Storage

Once installed and configured, the storage system will automatically:
- Create the required tables (`likes` and `comments`) on first use
- Use the database for storing likes and comments
- Fall back to file system if database is unavailable

## Troubleshooting

### "Cannot find module '@vercel/postgres'"

- Make sure you've run `npm install @vercel/postgres`
- Restart your development server
- Check that the package appears in `package.json` dependencies

### "Database not available" warning

- Verify `POSTGRES_URL` is set in your environment variables
- Check that the connection string is correct
- Make sure the database is accessible from your network
- Check Vercel dashboard to ensure the database is running

### Still using file system?

- Check that `POSTGRES_URL` environment variable is set correctly
- Restart your development server after setting environment variables
- Check console logs for error messages

## Notes

- The database tables are created automatically on first use - no manual setup required
- The storage system gracefully falls back to file system if the database is unavailable
- You can use the database in production while still using file system in development (or vice versa)

