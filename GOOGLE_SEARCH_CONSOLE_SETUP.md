# Google Search Console Setup Guide

## Step 1: Verify Your Site Ownership

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"** or **"Add a property"**
3. Select **"URL prefix"** (recommended)
4. Enter your domain: `https://albertblibo.com`
5. Click **"Continue"**

### Verification Methods

Choose one of these methods:

**Option A: HTML File Upload (Easiest)**
1. Download the HTML verification file Google provides
2. Upload it to your site's `public/` directory
3. Commit and push to trigger a deployment
4. Click "Verify" in Search Console

**Option B: HTML Tag**
1. Copy the meta tag Google provides
2. Add it to `app/layout.tsx` in the `<head>` section
3. Deploy and verify

**Option C: DNS Record (Most Reliable)**
1. Add the TXT record Google provides to your domain's DNS
2. Wait for DNS propagation (can take up to 48 hours)
3. Click "Verify" in Search Console

## Step 2: Submit Your Sitemap

Once your site is verified:

1. In Google Search Console, go to **"Sitemaps"** in the left sidebar
2. Under **"Add a new sitemap"**, enter: `sitemap.xml`
3. Click **"Submit"**

**Your sitemap URL will be:**
```
https://albertblibo.com/sitemap.xml
```

## Step 3: Verify Sitemap is Working

Before submitting, verify your sitemap is accessible:

1. Visit: `https://albertblibo.com/sitemap.xml`
2. You should see an XML file with all your pages listed
3. Check that all URLs use `https://` (not `http://`)

## Step 4: Monitor Submission Status

After submitting:
- Status will show as **"Success"** when Google has processed it
- You'll see how many URLs were discovered
- Processing can take a few hours to a few days

## Troubleshooting

### Sitemap Not Found
- Ensure `NEXT_PUBLIC_SITE_URL` is set to `https://albertblibo.com` in Vercel
- Verify the sitemap is accessible at the URL
- Check that your site is deployed and live

### URLs Not Indexed
- This is normal - Google indexes pages over time
- Ensure your `robots.txt` allows crawling (it does)
- Check for any crawl errors in Search Console

### Sitemap Shows Errors
- Verify all URLs in the sitemap use HTTPS
- Check that all URLs return 200 status codes
- Ensure URLs match your actual site structure

## Additional Tips

1. **Request Indexing** for important pages:
   - Use the URL Inspection tool in Search Console
   - Click "Request Indexing" for key pages

2. **Monitor Performance**:
   - Check "Performance" section for search analytics
   - Review "Coverage" for indexing issues

3. **Submit RSS Feed** (Optional):
   - You can also submit: `https://albertblibo.com/rss`
   - Helps Google discover new content faster

## Quick Checklist

- [ ] Site verified in Google Search Console
- [ ] Sitemap accessible at `https://albertblibo.com/sitemap.xml`
- [ ] Sitemap submitted in Search Console
- [ ] Status shows "Success" (may take time)
- [ ] Monitor for any errors or warnings

