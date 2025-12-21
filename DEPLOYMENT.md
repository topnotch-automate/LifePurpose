# Deployment Guide

This guide covers multiple deployment options for your author platform. The platform is built with Next.js, which works best with platforms that support Node.js and static site generation.

---

## Option 1: Vercel (Recommended) ⭐

Vercel is created by the Next.js team and offers the best integration and performance for Next.js applications.

### Prerequisites
- GitHub, GitLab, or Bitbucket account
- Vercel account (free tier available)

### Steps

1. **Push your code to a Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/author-platform.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Environment Variables** (if needed)
   - In your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add any variables you need:
     ```
     NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
     AUTHOR_NAME=Your Name
     AUTHOR_EMAIL=your@email.com
     ```

4. **Custom Domain** (optional)
   - In project settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### Vercel Benefits
- ✅ Zero configuration
- ✅ Automatic deployments on git push
- ✅ Edge network for fast global performance
- ✅ Free tier with generous limits
- ✅ Built-in HTTPS
- ✅ Preview deployments for pull requests

---

## Option 2: Netlify

Netlify is another excellent platform for Next.js applications.

### Prerequisites
- GitHub, GitLab, or Bitbucket account
- Netlify account (free tier available)

### Steps

1. **Push your code to Git** (same as Vercel step 1)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `.next`
   - Click "Deploy site"

3. **Configure Environment Variables**
   - Site settings → Environment variables
   - Add your variables

4. **Netlify Configuration File** (optional)
   Create `netlify.toml` in project root:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

### Netlify Benefits
- ✅ Good Next.js support (requires plugin)
- ✅ Free tier available
- ✅ Continuous deployment
- ✅ Form handling built-in

---

## Option 3: Self-Hosting (VPS/Dedicated Server)

For full control, you can deploy to your own server.

### Prerequisites
- VPS or dedicated server (Ubuntu/Debian recommended)
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx or Apache for reverse proxy
- Domain name with DNS configured

### Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install -y nginx
   ```

2. **Deploy Your Code**
   ```bash
   # Clone your repository
   git clone https://github.com/yourusername/author-platform.git
   cd author-platform
   
   # Install dependencies
   npm install
   
   # Build the application
   npm run build
   ```

3. **Run with PM2**
   ```bash
   # Start the application
   pm2 start npm --name "author-platform" -- start
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   ```

4. **Configure Nginx**
   Create `/etc/nginx/sites-available/author-platform`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   
   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/author-platform /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

6. **Environment Variables**
   Create `.env.local` in your project directory:
   ```env
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   AUTHOR_NAME=Your Name
   AUTHOR_EMAIL=your@email.com
   NODE_ENV=production
   ```

---

## Option 4: Docker Deployment

For containerized deployment.

### Create Dockerfile

Create `Dockerfile` in project root:
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Update next.config.ts

Add output configuration:
```typescript
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  output: 'standalone', // Add this for Docker
};
```

### Build and Run

```bash
# Build image
docker build -t author-platform .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=https://yourdomain.com \
  -e AUTHOR_NAME="Your Name" \
  author-platform
```

---

## Pre-Deployment Checklist

### ✅ Before Deploying

- [ ] **Environment Variables**
  - Set `NEXT_PUBLIC_SITE_URL` to your production URL
  - Configure `AUTHOR_NAME` and `AUTHOR_EMAIL` if needed

- [ ] **Content**
  - Review and update example content
  - Ensure all content files are in `content/` directory
  - Test locally with `npm run build` and `npm start`

- [ ] **Data Directory**
  - Ensure `data/` directory exists (will be created automatically)
  - For production, consider migrating to a database

- [ ] **SEO Metadata**
  - Update site metadata in `app/layout.tsx`
  - Update RSS feed title/description in `app/rss/route.ts`

- [ ] **Contact Form**
  - Configure email service for contact form (currently logs to console)
  - Update `app/api/contact/route.ts` with email integration

- [ ] **Build Test**
  ```bash
  npm run build
  npm start
  ```
  Verify everything works in production mode

---

## Post-Deployment Steps

### 1. Verify Deployment
- [ ] Visit your deployed site
- [ ] Test navigation
- [ ] Test article reading
- [ ] Test search functionality
- [ ] Test like/comment features
- [ ] Test RSS feed (`/rss`)
- [ ] Test on mobile devices

### 2. Setup Monitoring
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Setup uptime monitoring
- [ ] Monitor performance metrics

### 3. Content Management
- [ ] Create content workflow
- [ ] Setup Git-based content updates
- [ ] Consider CMS integration if needed

### 4. Security
- [ ] Review security headers
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Review API routes for rate limiting
- [ ] Consider authentication for author features

---

## Troubleshooting

### Build Errors
- Ensure all dependencies are in `package.json`
- Check Node.js version (18+ required)
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Runtime Errors
- Check environment variables are set correctly
- Verify file paths (case-sensitive on Linux)
- Check server logs for specific errors

### Performance Issues
- Enable static generation for content pages (already configured)
- Optimize images (consider Next.js Image component)
- Review bundle size with `npm run build` output

---

## Migration to Database (Future)

Currently, the platform uses file-based storage (`data/likes.json`, `data/comments.json`). For production scale, consider migrating to PostgreSQL:

1. Setup PostgreSQL database
2. Create schema for likes and comments
3. Update API routes to use database
4. Migrate existing data
5. Update deployment to include database connection

See project requirements for PostgreSQL integration plan.

---

## Recommended: Vercel

For this Next.js platform, **Vercel is the recommended deployment option** because:
- Built by Next.js creators
- Zero configuration needed
- Best performance optimization
- Free tier is generous
- Automatic SSL and CDN
- Easy custom domain setup
- Preview deployments for testing

---

## Quick Start: Deploy to Vercel in 5 Minutes

1. Push code to GitHub
2. Go to vercel.com and sign in
3. Import your repository
4. Click "Deploy"
5. Done! Your site is live

Your platform will be accessible at `your-project.vercel.app` and can be configured with a custom domain.

