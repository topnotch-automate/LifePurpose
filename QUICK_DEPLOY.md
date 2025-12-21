# Quick Deploy Guide 🚀

## Deploy to Vercel in 3 Steps

### Step 1: Push to GitHub
```bash
# In your project directory
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/author-platform.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Select your `author-platform` repository
5. Click "Deploy" (settings are auto-detected)

### Step 3: Configure (Optional)
In Vercel project settings → Environment Variables:
```
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
AUTHOR_NAME=Your Name
```

**That's it!** Your site is live at `your-project.vercel.app`

---

## Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Follow DNS instructions
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

---

## What Happens Next?

✅ **Automatic Deployments**: Every push to `main` branch auto-deploys  
✅ **Preview Deployments**: Pull requests get preview URLs  
✅ **HTTPS**: Automatically enabled  
✅ **CDN**: Global edge network for fast performance  

---

## Need More Details?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Netlify deployment
- Self-hosting options
- Docker deployment
- Advanced configuration

