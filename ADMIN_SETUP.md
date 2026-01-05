# Admin Setup Guide

## Overview

The admin system allows you to login and manage reader comments on your platform. It uses password-based authentication with secure session cookies.

## Setup

### 1. Set Admin Password

Add the `ADMIN_PASSWORD` environment variable:

**Local Development** (`.env.local`):
```env
ADMIN_PASSWORD=your_secure_password_here
```

**Production (Vercel)**:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add `ADMIN_PASSWORD` with your secure password
4. Redeploy if needed

**Important**: 
- Use a strong, unique password
- Never commit the password to git
- The `.env.local` file should already be in `.gitignore`

### 2. Access Admin Dashboard

1. Navigate to: `https://your-domain.com/admin`
2. Enter your admin password
3. You'll be redirected to the dashboard at `/admin/dashboard`

## Features

### Admin Dashboard

The dashboard allows you to:
- **View all comments** across all articles and videos
- **Delete comments** with confirmation
- **See comment details**: author, date, content type, content ID
- **Navigate to content** where comments were made

### Security Features

- ✅ Password-protected login
- ✅ Secure HTTP-only cookies for sessions
- ✅ Session expires after 7 days
- ✅ Admin routes excluded from search engines (robots.txt)
- ✅ All admin API routes require authentication

## Usage

### Login

1. Visit `/admin`
2. Enter your password (set via `ADMIN_PASSWORD` environment variable)
3. Click "Login"

### Managing Comments

1. Once logged in, you'll see all comments in a list
2. Each comment shows:
   - Author name
   - Comment content
   - Date and time
   - Content type (article/video)
   - Link to the content page
3. To delete a comment:
   - Click the "Delete" button
   - Confirm the deletion
   - The comment and all its replies will be removed

### Logout

Click the "Logout" button in the top right of the dashboard to end your session.

## Default Password

**⚠️ Important**: If no `ADMIN_PASSWORD` is set, the default password is `"admin"`. 

**You MUST set a secure password in production!**

## Troubleshooting

### Can't Login

1. Check that `ADMIN_PASSWORD` environment variable is set correctly
2. Make sure you're using the exact password (case-sensitive)
3. Check browser console for errors
4. Try clearing cookies and logging in again

### Comments Not Showing

1. Verify you're logged in (check session cookie)
2. Check that comments exist in your database/file system
3. Check browser console for API errors

### Delete Not Working

1. Verify you're logged in
2. Check browser console for errors
3. Refresh the page and try again

## Security Best Practices

1. **Use a strong password**: At least 12 characters, mix of letters, numbers, and symbols
2. **Change password regularly**: Update `ADMIN_PASSWORD` environment variable
3. **Keep password secret**: Never share or commit to git
4. **Logout when done**: Especially on shared computers
5. **Use HTTPS**: Vercel automatically provides HTTPS in production

## Future Enhancements

Potential improvements for the admin system:
- Multiple admin users
- Comment approval workflow
- Edit comments functionality
- Bulk operations
- Comment search/filter
- Activity logs
- Two-factor authentication

