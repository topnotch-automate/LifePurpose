# Author Interaction Guide

## Overview

The platform now includes author interaction features that allow you to engage with your readers through likes and replies on comments.

## Features

### 1. Author Identification

Authors are identified by name. The author name is configured in `lib/author.ts`:

```typescript
export const AUTHOR_NAME = process.env.AUTHOR_NAME || "Your Name";
```

You can set this via environment variable or update directly in the file.

### 2. Author Features

**Like Comments:**
- As the author, you'll see a heart icon next to each comment
- Click to like/unlike comments to show appreciation
- Liked comments show a red heart

**Reply to Comments:**
- Click "Reply as author" on any comment
- Write your response in the reply form
- Replies appear nested under the original comment
- Author replies are marked with an "Author" badge

**Author Badge:**
- Your comments and replies display an "Author" badge
- This helps readers identify your responses

## Enabling Author Mode

Currently, author features are enabled via localStorage. To enable:

1. Open browser console
2. Run: `localStorage.setItem("isAuthor", "true")`
3. Refresh the page

### Future Authentication

For production, you should implement proper authentication:

1. Create an admin/login page
2. Use sessions or JWT tokens
3. Update `CommentItem.tsx` to check authenticated user
4. Update `lib/author.ts` to verify authentication

Example enhancement:

```typescript
// lib/auth.ts (future implementation)
export function isAuthenticatedAuthor(): boolean {
  // Check session/token
  // Verify user is the author
  return true; // placeholder
}
```

## Comment Structure

Comments now support:
- Top-level comments (direct responses to content)
- Replies (nested under comments)
- Author likes (tracked per comment)

## Data Storage

All interactions are stored in:
- `data/comments.json` - All comments and replies
- Each comment includes:
  - Basic info (author, content, date)
  - Replies array
  - Author liked status

## Best Practices

1. **Engage Regularly**: Check comments and reply to show you're listening
2. **Be Authentic**: Personal replies build stronger connections
3. **Be Timely**: Quick responses show you value reader input
4. **Like Thoughtfully**: Use likes to acknowledge helpful comments

## Privacy & Moderation

Currently, all comments are public. Future enhancements could include:
- Comment moderation/approval queue
- Email notifications for new comments
- Spam detection
- User blocking/reporting

