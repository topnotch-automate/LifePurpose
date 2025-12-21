# Author Platform

A unified personal platform for publishing wisdom through **Esoteriment** and **Lifeward**.

## Overview

This is a modern, code-first author platform built with Next.js, TypeScript, and MDX. It provides a frictionless writing experience while maintaining full ownership and control over your content.

## Features

- ✅ **Two Section Architecture**: Esoteriment and Lifeward with distinct themes
- ✅ **MDX-Based Content**: Write in Markdown with React components
- ✅ **Video Embedding**: Curate video teachings from YouTube, TikTok, Instagram
- ✅ **Books Library**: Showcase your mini-books with download/purchase links
- ✅ **Clean Design**: Minimal, timeless UI with calm color palette
- ✅ **SEO Optimized**: Built-in metadata and Open Graph support
- ✅ **Reading Time**: Automatic calculation for articles
- ✅ **Responsive**: Mobile-first design

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

### Building

```bash
npm run build
npm start
```

## Deployment

### Quick Deploy (Recommended)

Deploy to Vercel in minutes:
1. Push code to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Click Deploy

See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for detailed steps.

For other deployment options (Netlify, Docker, VPS), see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Project Structure

```
author-platform/
├── app/                    # Next.js App Router pages
│   ├── esoteriment/        # Esoteriment section
│   ├── lifeward/          # Lifeward section
│   ├── books/             # Books library
│   ├── videos/            # Video teachings
│   └── about/             # About page
├── content/               # MDX content files
│   ├── esoteriment/       # Esoteriment articles
│   ├── lifeward/         # Lifeward articles
│   ├── videos/           # Video content
│   └── books/            # Book metadata
├── components/            # React components
│   ├── layout/           # Navigation, Footer
│   ├── article/          # Article components
│   ├── video/            # Video components
│   └── ui/               # UI components
└── lib/                   # Utilities
    ├── mdx.ts            # Content loading
    ├── theme.ts          # Design tokens
    └── utils.ts          # Helper functions
```

## Writing Content

### Creating an Article

Create a new `.mdx` file in `content/esoteriment/` or `content/lifeward/`:

```mdx
---
title: "Your Article Title"
description: "A brief description"
date: "2026-01-08"
category: "Consciousness"
tags: ["mind", "awareness"]
section: "esoteriment"
---

Your content here in Markdown format.

> Blockquotes work too.

## Headers

And all standard Markdown features.
```

### Adding a Video

Create a `.mdx` file in `content/videos/`:

```mdx
---
title: "Video Title"
description: "Video description"
platform: "youtube"
embedUrl: "https://www.youtube.com/embed/VIDEO_ID"
section: "lifeward"
relatedArticle: "article-slug"
date: "2026-01-08"
---

Optional content that appears below the video.
```

## Customization

### Theme Colors

Edit `lib/theme.ts` to customize section colors:

```typescript
export const themes = {
  esoteriment: {
    accent: "#7C8A9E",
    background: "#FAFAF9",
  },
  lifeward: {
    accent: "#9A7B4F",
    background: "#FFFDF8",
  },
};
```

### Site Name

Update the navigation in `components/layout/Navigation.tsx` and metadata in `app/layout.tsx`.

## Deployment

This platform is ready to deploy to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any platform that supports Next.js

## Future Enhancements

- [ ] RSS feed generation
- [ ] Search functionality
- [ ] Newsletter integration
- [ ] Comment system
- [ ] Analytics dashboard
- [ ] Daily Practice Generator

## License

Private - All rights reserved.
