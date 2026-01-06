# Contact Form Email Setup

The contact form on the About page now sends emails using Resend. Follow these steps to configure it.

## Step 1: Get Resend API Key

1. Go to [resend.com](https://resend.com) and sign up (free tier available)
2. Verify your domain (or use their test domain for testing)
3. Go to API Keys section
4. Create a new API key
5. Copy the API key (starts with `re_`)

## Step 2: Configure Environment Variables

Add these environment variables in your Vercel project settings:

### Required Variables

```
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=your-email@example.com
```

### Optional Variables

```
RESEND_FROM_EMAIL=noreply@albertblibo.com
```

**Note:** If `RESEND_FROM_EMAIL` is not set, it will default to `onboarding@resend.dev` (Resend's test domain).

## Step 3: Domain Verification (Recommended)

For production, you should verify your domain in Resend:

1. In Resend dashboard, go to **Domains**
2. Add your domain: `albertblibo.com`
3. Add the DNS records provided by Resend to your domain registrar
4. Wait for verification (usually takes a few minutes)
5. Once verified, update `RESEND_FROM_EMAIL` to use your domain:
   ```
   RESEND_FROM_EMAIL=noreply@albertblibo.com
   ```

## Step 4: Test the Contact Form

1. Visit: `https://albertblibo.com/about`
2. Fill out and submit the contact form
3. Check your email inbox (the address you set in `CONTACT_EMAIL`)
4. You should receive the contact form submission

## How It Works

- **Form submission** → Validates input
- **Email sending** → Uses Resend API to send email
- **Reply-to** → Set to the submitter's email (so you can reply directly)
- **Fallback** → If Resend is not configured, form still works but logs a warning

## Troubleshooting

### Emails Not Arriving

1. **Check Resend Dashboard**
   - Go to Resend dashboard → Logs
   - Check if emails are being sent
   - Look for any error messages

2. **Check Environment Variables**
   - Verify `RESEND_API_KEY` is set correctly in Vercel
   - Verify `CONTACT_EMAIL` is set correctly
   - Redeploy after adding environment variables

3. **Check Spam Folder**
   - Emails might be in spam/junk folder
   - Add `noreply@albertblibo.com` to your contacts

4. **Domain Verification**
   - If using custom domain, ensure it's verified in Resend
   - Check DNS records are correct

### Form Shows Success But No Email

- Check Vercel function logs for warnings
- The form will show success even if email fails (to prevent exposing errors)
- Check Resend dashboard logs for delivery status

### Testing Without Resend

The form will still work without Resend configured:
- Form submissions are logged to console
- User sees success message
- No emails are sent
- Warnings are logged in Vercel function logs

## Environment Variables Summary

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `RESEND_API_KEY` | Yes | Your Resend API key | `re_abc123...` |
| `CONTACT_EMAIL` | Yes | Email where contact form messages are sent | `albert@example.com` |
| `RESEND_FROM_EMAIL` | No | Email address to send from | `noreply@albertblibo.com` |
| `AUTHOR_EMAIL` | Fallback | Used if `CONTACT_EMAIL` is not set | `albert@example.com` |

## Free Tier Limits

Resend free tier includes:
- 3,000 emails/month
- 100 emails/day
- Perfect for personal sites

For higher limits, upgrade to a paid plan.

## Security Notes

- Never commit API keys to git
- Always use environment variables
- API keys are only used server-side (in API routes)
- Form includes basic validation and spam protection

