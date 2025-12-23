# Content Management System

Automated content generation and frontmatter management for your MDX files.

## Overview

This system allows you to:
- **Create new content** without manually writing frontmatter
- **Edit content directly** - frontmatter is automatically managed
- **Sync frontmatter** - auto-generate descriptions and update dates

## Quick Start

### Create New Content

```bash
npm run content:new
```

### Validate Content

```bash
npm run content:validate
```

### Sync Content

```bash
npm run content:sync
```

Or use the interactive menu:
```bash
npm run content
```

This will:
1. Prompt you for content type (Article, Video, or Book)
2. Ask for required fields (title, section, etc.)
3. Generate a properly formatted MDX file with frontmatter
4. Create the file in the correct directory

### Sync Existing Content

```bash
npm run content:sync
```

This allows you to:
- Add missing descriptions (auto-extracted from content)
- Update dates based on file modification time
- Sync all content or specific files

### Validate All Content

```bash
npm run content:validate
```

This validates all content files and checks for:
- Required frontmatter fields (title, date, section)
- Valid date formats (YYYY-MM-DD)
- Valid section values (esoteriment/lifeward)
- Section matches directory location
- Required fields for videos (embedUrl) and books (description)
- Filename matches title slug (warning)
- Missing descriptions (warning)

**Use this before deploying** to catch errors early. Exit code 1 if errors found (useful for CI/CD).

## Workflow

### Recommended Writing Workflow

1. **Create the file:**
   ```bash
   npm run content:new
   ```
   - Choose content type
   - Enter title and basic metadata
   - File is created with starter frontmatter

2. **Write your content:**
   - Edit the `.mdx` file directly
   - Add your markdown content below the frontmatter
   - **Don't worry about frontmatter** - it stays intact

3. **Validate before deploying:**
   ```bash
   npm run content:validate
   ```
   - Checks for errors and warnings
   - Fix any errors before deploying
   - Warnings are informational

4. **Sync if needed (optional):**
   ```bash
   npm run content:sync
   ```
   - Optionally sync descriptions and dates
   - This is **not required** - you can edit frontmatter manually if preferred

## Content Types

### Articles

**Location:** `content/esoteriment/` or `content/lifeward/`

**Required fields:**
- `title` - Article title
- `section` - "esoteriment" or "lifeward"
- `date` - Publication date (auto-generated)

**Optional fields:**
- `description` - Brief description (can be auto-generated)
- `category` - Article category
- `tags` - Array of tags
- `image` - Featured image path
- `funnel` - Book funnel metadata

**Example:**
```mdx
---
title: "What Consciousness Really Is"
description: "A clear explanation of consciousness..."
date: "2026-01-04"
category: "Consciousness"
tags: ["mind", "awareness", "being"]
section: "esoteriment"
---

Your content here...
```

### Videos

**Location:** `content/videos/`

**Required fields:**
- `title` - Video title
- `embedUrl` - Video embed URL
- `section` - "esoteriment" or "lifeward"
- `date` - Publication date

**Optional fields:**
- `description` - Video description
- `platform` - Video platform (default: "youtube")
- `relatedArticle` - Related article slug
- `thumbnail` - Thumbnail image path

### Books

**Location:** `content/books/`

**Required fields:**
- `title` - Book title
- `date` - Publication date

**Optional fields:**
- `subtitle` - Book subtitle
- `description` - Book description
- `cover` - Cover image path
- `themes` - Array of themes
- `price` - Price in currency units
- `currency` - Currency code (default: "USD")
- `status` - "free" or "paid"
- `downloadLink` - Free download URL
- `purchaseLink` - Purchase URL
- `purchaseUrl` - Internal purchase URL

## Features

### Auto-Generated Descriptions

When syncing, the system can automatically extract descriptions from your content:
- Finds the first meaningful paragraph
- Removes markdown formatting
- Limits to 160 characters
- Only adds if description is missing

### Date Management

Dates can be automatically updated based on file modification time:
- Useful for keeping dates in sync with when you actually wrote content
- Optional - you can manually manage dates if preferred

### Slug Generation

Filenames are automatically generated from titles:
- Lowercase
- Spaces converted to hyphens
- Special characters removed
- URL-friendly

Example: "What Consciousness Really Is" → `what-consciousness-really-is.mdx`

## Manual Frontmatter Editing

You can still edit frontmatter manually if you prefer:
- Frontmatter is YAML format between `---` delimiters
- Located at the top of each `.mdx` file
- Your content goes below the frontmatter

The sync tool **will not overwrite** existing frontmatter fields - it only adds missing ones or updates based on your chosen sync options.

## Validation

The validation command checks all content files for consistency and correctness:

### Errors (Must Fix)
- Missing required fields (title, date, section)
- Invalid date formats
- Invalid section values
- Section doesn't match directory
- Missing video embedUrl
- Missing book description
- File parse errors

### Warnings (Informational)
- Missing descriptions (recommended for SEO)
- Filename doesn't match title slug
- Empty content (frontmatter only)
- Missing book themes array

### Usage in CI/CD

The validation command exits with code 1 if errors are found, making it perfect for CI/CD:

```bash
npm run content:validate
# If errors found, exit code 1 prevents deployment
```

You can add this to your build process to prevent invalid content from being deployed.

## Tips

1. **Focus on writing** - Let the tools handle metadata
2. **Validate before deploying** - Run `npm run content:validate` to catch issues
3. **Sync periodically** - Run `npm run content:sync` to keep metadata fresh
4. **Manual edits are fine** - The system doesn't lock you in
5. **Descriptions are optional** - They're nice to have but not required (warnings only)

## Troubleshooting

### File already exists
If a file with the same slug already exists, you'll be prompted to overwrite or cancel.

### Missing descriptions
Run `npm run content:sync` and choose "Add missing descriptions only" to auto-generate them.

### Dates not updating
Use `npm run content:sync` with "Update dates from file modification time" option.

