# Integrations Guide

This document explains how to set up and use the production integrations for the Lifeward site.

## Overview

All integrations are designed to work gracefully without production dependencies. The site will function locally even if services aren't configured, using fallbacks where appropriate.

## Email Service (Resend)

### Setup

1. Sign up for a Resend account at [resend.com](https://resend.com)
2. Create an API key in your dashboard
3. Add to your `.env.local` file:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@lifeward.com
RESEND_FROM_NAME=Lifeward
RESEND_REPLY_TO=contact@lifeward.com
```

### Features

- Contact form submissions
- Booking confirmation emails
- Session reminders (future)

### Fallback Behavior

- **Development**: If `RESEND_API_KEY` is not set, emails are logged to the console
- **Production**: Returns an error if email service is not configured

## Booking System

### Option 1: Cal.com

1. Sign up at [cal.com](https://cal.com)
2. Get your username and API key
3. Add to your `.env.local` file:

```env
NEXT_PUBLIC_CALCOM_USERNAME=your-username
CALCOM_API_KEY=cal_xxxxxxxxxxxxx
```

The booking widget will automatically embed your Cal.com scheduling page.

### Option 2: Calendly

1. Sign up at [calendly.com](https://calendly.com)
2. Get your username
3. Add to your `.env.local` file:

```env
NEXT_PUBLIC_CALENDLY_USERNAME=your-username
```

The booking widget will automatically embed your Calendly scheduling page.

### Fallback Behavior

If neither Cal.com nor Calendly is configured, the site shows a custom intake form that:
- Collects booking information
- Sends confirmation email (if Resend is configured)
- Stores intake data (ready for database integration)

## Environment Variables

### Required for Production

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
CONTACT_EMAIL=contact@yourdomain.com
```

### Optional (with fallbacks)

```env
# Email
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=Lifeward
RESEND_REPLY_TO=contact@yourdomain.com

# Booking
NEXT_PUBLIC_CALCOM_USERNAME=your-username
CALCOM_API_KEY=cal_xxxxxxxxxxxxx
# OR
NEXT_PUBLIC_CALENDLY_USERNAME=your-username
```

## Local Development

For local development, you can:

1. **Work without any services**: The site will use fallbacks (console logging, intake forms)
2. **Test with services**: Add your API keys to `.env.local` (gitignored)
3. **Use mock data**: All API routes handle missing configuration gracefully

## API Routes

### `/api/contact`

Handles contact form submissions.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "inquiryType": "coaching",
  "message": "I'm interested in..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your message..."
}
```

### `/api/booking/intake`

Handles booking intake form submissions.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "sessionType": "60",
  "seekingClarity": "I want to understand...",
  "currentChallenges": "Optional...",
  "expectations": "Optional..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your booking request...",
  "intakeId": "intake-1234567890"
}
```

## Testing

### Test Email Service

1. Set `RESEND_API_KEY` in `.env.local`
2. Submit the contact form
3. Check your Resend dashboard for sent emails

### Test Booking System

1. Set `NEXT_PUBLIC_CALCOM_USERNAME` or `NEXT_PUBLIC_CALENDLY_USERNAME`
2. Visit `/sessions` page
3. Booking widget should show embedded calendar

### Test Fallbacks

1. Remove all API keys from `.env.local`
2. Submit forms - they should still work with console logging
3. Booking should show intake form instead of embedded calendar

## Production Deployment

### Vercel

1. Add environment variables in Vercel dashboard
2. Deploy - all services will work automatically

### Other Platforms

1. Set environment variables in your hosting platform
2. Ensure `NEXT_PUBLIC_*` variables are available at build time
3. Server-side variables (like `RESEND_API_KEY`) are available at runtime

## Troubleshooting

### Emails not sending

- Check `RESEND_API_KEY` is set correctly
- Verify domain is verified in Resend dashboard
- Check Resend dashboard for error logs

### Booking widget not showing

- Verify `NEXT_PUBLIC_CALCOM_USERNAME` or `NEXT_PUBLIC_CALENDLY_USERNAME` is set
- Check browser console for errors
- Ensure iframe is not blocked by browser

### Forms not working

- Check browser console for errors
- Verify API routes are accessible
- Check server logs for detailed error messages

