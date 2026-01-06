# SSL/HTTPS Setup Guide for albertblibo.com

## The "Not Secure" Warning

If you're seeing a "Not secure" warning on albertblibo.com, it means the site is not using HTTPS. Here's how to fix it:

## Solution: Configure Domain in Vercel

Vercel automatically provides free SSL certificates for all domains, but you need to properly configure your custom domain.

### Step 1: Add Domain in Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Select your project (author-platform)
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `albertblibo.com`
6. Also add: `www.albertblibo.com` (optional but recommended)

### Step 2: Configure DNS Records

Vercel will provide you with DNS records to add. You need to add these at your domain registrar (where you bought albertblibo.com):

**For Root Domain (albertblibo.com):**
- **Type:** A Record
- **Name:** @ (or leave blank)
- **Value:** 76.76.21.21 (Vercel's IP - verify in dashboard)

**OR use CNAME (recommended):**
- **Type:** CNAME
- **Name:** @ (or leave blank) 
- **Value:** cname.vercel-dns.com (verify exact value in Vercel dashboard)

**For www subdomain:**
- **Type:** CNAME
- **Name:** www
- **Value:** cname.vercel-dns.com (verify exact value in Vercel dashboard)

### Step 3: Wait for DNS Propagation

- DNS changes can take 24-48 hours to propagate
- You can check status at: https://dnschecker.org
- Vercel dashboard will show when DNS is configured correctly

### Step 4: SSL Certificate Provisioning

Once DNS is configured:
- Vercel automatically provisions SSL certificates (Let's Encrypt)
- This usually takes 5-10 minutes after DNS is verified
- You'll see a green checkmark in Vercel dashboard when SSL is active

### Step 5: Update Environment Variables

In Vercel project settings → Environment Variables:
```
NEXT_PUBLIC_SITE_URL=https://albertblibo.com
```

### Step 6: Force HTTPS Redirect

The `next.config.ts` has been updated to include HTTPS redirect. After deploying:
- HTTP requests will automatically redirect to HTTPS
- This ensures all traffic uses secure connections

## Verify SSL is Working

1. Visit: https://albertblibo.com (note the `https://`)
2. Check browser address bar for padlock icon 🔒
3. Test: https://www.ssllabs.com/ssltest/analyze.html?d=albertblibo.com

## Common Issues

### Issue: DNS not configured
**Solution:** Make sure DNS records are added at your domain registrar

### Issue: DNS not propagated
**Solution:** Wait 24-48 hours, or check with your registrar

### Issue: Certificate not issued
**Solution:** 
- Verify DNS is correct in Vercel dashboard
- Wait 10-15 minutes after DNS verification
- Check Vercel deployment logs

### Issue: Mixed content warnings
**Solution:** Ensure all resources (images, scripts) use HTTPS URLs

## Quick Checklist

- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured at registrar
- [ ] DNS propagated (check with dnschecker.org)
- [ ] SSL certificate active (green checkmark in Vercel)
- [ ] Environment variable `NEXT_PUBLIC_SITE_URL` set to `https://albertblibo.com`
- [ ] Site accessible via HTTPS
- [ ] HTTP redirects to HTTPS automatically

## Need Help?

- Vercel Docs: https://vercel.com/docs/concepts/projects/domains
- Vercel Support: https://vercel.com/support

