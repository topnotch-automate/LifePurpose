# How to Add Mini-Books to Your Platform

## Overview

Mini-books are added using **MDX files** in the `content/books/` directory. Each book is a simple markdown file with frontmatter metadata.

## Step-by-Step Process

### 1. Create the Book Directory (if it doesn't exist)

```bash
mkdir -p content/books
```

### 2. Create a New Book File

Create a new `.mdx` file in `content/books/` with a URL-friendly slug name.

**Example:** `content/books/quicken-your-manifestation.mdx`

### 3. Add Book Metadata

Each book file starts with frontmatter (YAML metadata between `---`):

```mdx
---
title: "Your Book Title"
description: "A compelling description of your book"
date: "2026-01-08"
cover: "/images/books/book-cover.jpg"
themes: ["Manifestation", "Law of Assumption", "Consciousness"]
sampleChapter: |
  This is a sample chapter that appears on the book detail page.
  You can write multiple paragraphs here.
  
  It supports markdown formatting too.
downloadLink: "https://your-site.com/downloads/book.pdf"
purchaseLink: "https://your-store.com/book"
---
```

### 4. Book Metadata Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | ✅ Yes | Book title | `"Quicken Your Manifestation"` |
| `description` | ✅ Yes | Brief description | `"A guide to..."` |
| `date` | ✅ Yes | Publication date | `"2026-01-08"` |
| `cover` | ❌ No | Cover image path | `"/images/books/cover.jpg"` |
| `themes` | ❌ No | Array of themes | `["Theme1", "Theme2"]` |
| `sampleChapter` | ❌ No | Sample text/chapter | Multi-line text |
| `downloadLink` | ❌ No | Free download URL | `"https://..."` |
| `purchaseLink` | ❌ No | Purchase URL | `"https://..."` |

### 5. Add Cover Image (Optional)

1. Place your cover image in `public/images/books/`
2. Reference it in the `cover` field: `cover: "/images/books/your-cover.jpg"`

**Recommended cover dimensions:** 300x400px (3:4 aspect ratio)

### 6. The Book File Structure

The MDX file can be minimal - just the frontmatter is enough! The content below the frontmatter is optional and currently not displayed (but you can add it for future use).

```mdx
---
title: "Your Book Title"
description: "Book description"
date: "2026-01-08"
themes: ["Theme 1", "Theme 2"]
sampleChapter: |
  Your sample chapter text here...
downloadLink: "https://..."
purchaseLink: "https://..."
---

<!-- Optional: You can add additional content here for future features -->
```

## Example Book File

Here's a complete example:

```mdx
---
title: "Quicken Your Manifestation"
description: "A practical guide to manifesting your desires through the Law of Assumption. Learn to align your consciousness with your desired reality."
date: "2026-01-08"
cover: "/images/books/quicken-manifestation.jpg"
themes: ["Manifestation", "Law of Assumption", "Consciousness", "Reality"]
sampleChapter: |
  ## Chapter 1: The Foundation
  
  Manifestation is not about wishing. It's about **becoming**.
  
  When you assume the feeling of the wish fulfilled, you align your consciousness with the reality you desire. This is not magic—it's the natural law of consciousness.
  
  > "Assume the feeling of your wish fulfilled and observe the route that your attention follows." - Neville Goddard
  
  The key is to feel it real. Not as something you want, but as something you already have.
downloadLink: "https://your-site.com/downloads/quicken-manifestation.pdf"
purchaseLink: "https://amazon.com/dp/1234567890"
---
```

## Where Books Appear

1. **Books Library Page** (`/books`):
   - Shows all books in a grid
   - Displays cover, title, description, themes
   - "View Details" button links to individual book page

2. **Individual Book Page** (`/books/[slug]`):
   - Full book details
   - Cover image
   - Core themes
   - Sample chapter
   - Download/Purchase buttons
   - Like button
   - Comments section

## Quick Checklist

- [ ] Create `.mdx` file in `content/books/`
- [ ] Add frontmatter with required fields (title, description, date)
- [ ] Add optional fields (cover, themes, sampleChapter, links)
- [ ] Place cover image in `public/images/books/` (if using)
- [ ] Test by visiting `/books` page
- [ ] Click "View Details" to see the full book page

## Tips

1. **Slug naming**: Use lowercase, hyphens for spaces (e.g., `my-awesome-book.mdx`)
2. **Cover images**: Use high-quality images, recommended 300x400px
3. **Themes**: Keep theme names short and descriptive
4. **Sample chapter**: Make it compelling to encourage downloads/purchases
5. **Links**: Use full URLs (https://...) for download and purchase links

## File Location Summary

```
author-platform/
├── content/
│   └── books/
│       ├── quicken-your-manifestation.mdx
│       ├── another-book.mdx
│       └── ...
├── public/
│   └── images/
│       └── books/
│           ├── quicken-manifestation.jpg
│           └── ...
```

That's it! Once you create the MDX file, the book automatically appears on your site.

