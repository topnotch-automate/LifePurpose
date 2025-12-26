# Author Features Guide

## Overview

As an authenticated admin/author, you can interact with reader comments in two ways:
1. **Like comments** - Show appreciation for reader comments
2. **Reply to comments** - Engage directly with your readers

## How to Enable Author Mode

1. **Login as Admin:**
   - Visit `/admin` on your site
   - Enter your admin password (set via `ADMIN_PASSWORD` environment variable)
   - Once logged in, you're automatically in "author mode"

2. **Author Features Become Available:**
   - After logging in, visit any article or video page
   - You'll see author controls on all reader comments

## Features

### Like Comments

- **Heart icon** appears next to each comment (except your own)
- Click to **like/unlike** a comment
- Liked comments show a **red heart**
- This shows readers that you've acknowledged their comment

### Reply to Comments

- **"Reply as author"** button appears below each comment
- Click to open a reply form
- Write your response
- Your replies are marked with an **"Author" badge**
- Replies appear nested under the original comment

### Author Badge

- Your comments and replies automatically display an **"Author" badge**
- Helps readers identify your official responses
- Badge color matches your site's accent colors

## Usage Tips

1. **After logging in**, navigate to any content page with comments
2. **Like thoughtful comments** to show appreciation
3. **Reply to questions** or comments that need a response
4. **Be authentic** - readers appreciate genuine engagement

## Technical Details

### Authentication

- Uses the same admin authentication system as the admin dashboard
- Session-based authentication (7-day cookie)
- No need to set localStorage flags - just login via `/admin`

### API Integration

- Author likes: `/api/comments/like`
- Author replies: `/api/comments/reply`
- Both require admin authentication (handled automatically when logged in)

## Security

- ✅ Secure session-based authentication
- ✅ HTTP-only cookies
- ✅ Author features only appear when authenticated
- ✅ API routes validate authentication on the server

## Notes

- **Session expires** after 7 days - you'll need to login again
- **Logout** via the admin dashboard or by clearing cookies
- **Author mode works everywhere** - any page with comments shows author controls when you're logged in

