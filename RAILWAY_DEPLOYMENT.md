# Railway Deployment Guide

This guide will help you deploy your author platform to Railway.

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub account with your code repository
- Domain name (optional, but recommended)

## Step 1: Prepare Your Repository

1. Ensure all changes are committed and pushed to GitHub:
   ```bash
   git add .
   git commit -m "Production-ready deployment"
   git push origin main
   ```

## Step 2: Deploy to Railway

1. **Create a New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Environment Variables**
   - In your Railway project, go to "Variables"
   - Add the following environment variables:
     ```
     NEXT_PUBLIC_SITE_URL=https://your-domain.com
     AUTHOR_NAME=Albert Blibo
     AUTHOR_EMAIL=your-email@example.com
     NEXT_PUBLIC_TWITTER_HANDLE=@albertblibo
     NODE_ENV=production
     PORT=3000
     ```

3. **Deploy**
   - Railway will automatically detect Next.js
   - The build will start automatically
   - Wait for deployment to complete

## Step 3: Configure Custom Domain (Optional)

1. In Railway project settings, go to "Settings" → "Domains"
2. Click "Generate Domain" or "Add Custom Domain"
3. For custom domain:
   - Add your domain (e.g., `lifeward.com`)
   - Railway will provide DNS records
   - Update your DNS settings with your domain provider
   - Wait for DNS propagation (can take up to 24 hours)

4. Update `NEXT_PUBLIC_SITE_URL` environment variable to your custom domain

## Step 4: Verify Deployment

1. Visit your Railway-provided URL or custom domain
2. Test all pages:
   - Homepage
   - Article pages
   - Video pages
   - Book pages
   - RSS feed (`/rss`)
   - Sitemap (`/sitemap.xml`)
   - Robots.txt (`/robots.txt`)

## Step 5: Post-Deployment

### SEO Verification

1. **Google Search Console**
   - Add your site to Google Search Console
   - Submit sitemap: `https://your-domain.com/sitemap.xml`
   - Verify ownership using `NEXT_PUBLIC_GOOGLE_VERIFICATION`

2. **Bing Webmaster Tools**
   - Add your site to Bing Webmaster Tools
   - Submit sitemap

### Monitoring

1. Set up monitoring (optional):
   - Railway provides basic metrics
   - Consider adding Sentry for error tracking
   - Use Google Analytics for traffic analysis

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Your site's public URL | Yes |
| `AUTHOR_NAME` | Author name | Yes |
| `AUTHOR_EMAIL` | Author email | No |
| `NEXT_PUBLIC_TWITTER_HANDLE` | Twitter handle for social cards | No |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Google Search Console verification | No |
| `NODE_ENV` | Set to `production` | Yes |
| `PORT` | Server port (Railway sets this automatically) | Auto |

## Troubleshooting

### Build Fails

- Check Railway build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version (18+ required)

### Site Not Loading

- Check environment variables are set correctly
- Verify `NEXT_PUBLIC_SITE_URL` matches your Railway domain
- Check Railway deployment logs

### Images Not Loading

- Ensure images are in the `public/` directory
- Check image paths are correct
- Verify Next.js Image optimization is working

## Railway-Specific Features

- **Automatic HTTPS**: Railway provides SSL certificates automatically
- **Auto-scaling**: Railway scales based on traffic
- **Zero-downtime deployments**: Updates deploy without downtime
- **Built-in monitoring**: View logs and metrics in Railway dashboard

## Cost

Railway offers a free tier with:
- $5 credit per month
- 500 hours of usage
- Perfect for personal projects

For production sites with high traffic, consider upgrading to a paid plan.

## Support

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)

