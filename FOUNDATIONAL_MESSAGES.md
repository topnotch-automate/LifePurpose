# Foundational Messages Feature

## Overview

Foundational messages are articles that serve as entry points for new readers. They can belong to either Esoteriment or Lifeward sections and are marked with a `foundational: true` flag in their frontmatter.

## How It Works

### Marking Articles as Foundational

Add `foundational: true` to an article's frontmatter:

```yaml
---
title: "Your Article Title"
description: "Article description"
date: "2024-01-01"
section: "esoteriment"
foundational: true
---
```

### Where Foundational Messages Appear

1. **Start Here Section** (Homepage)
   - The "Begin with Esoteriment" and "Begin with Lifeward" buttons link directly to foundational messages
   - If no foundational message exists for a section, links fall back to the section page

2. **Deeper Exploration CTAs** (Homepage)
   - "Read a foundational Esoteriment article" CTA
   - "Start your Lifeward journey here" CTA
   - These also prioritize foundational messages

### Technical Implementation

#### Type Definition

The `Article` interface includes:
```typescript
foundational?: boolean;
```

#### Helper Functions

- `getFoundationalMessages(section)`: Returns all foundational messages for a section
- `getFirstFoundationalMessage(section)`: Returns the first foundational message (for CTAs)

#### Content Manager

When creating new articles via `npm run content:new`, you'll be prompted:
```
Is this a foundational message? (appears in Start Here section)
```

## Usage Guidelines

### When to Mark an Article as Foundational

- Articles that serve as perfect entry points for new readers
- Core philosophy or methodology explanations
- "What is Esoteriment?" or "What is Lifeward?" type articles
- Articles that explain the fundamental principles of each section

### Best Practices

- **Keep it focused**: Only mark truly foundational articles
- **One per section recommended**: Having one clear entry point per section is ideal
- **Update over time**: As your content evolves, you can update which article is foundational

## Examples

### Esoteriment Foundational Message
An article like "Understanding Esoteriment: The Path to Inner Clarity" would be a good foundational message that explains the core concepts.

### Lifeward Foundational Message
An article like "Living Lifeward: Daily Practice of Spiritual Truths" would serve as an excellent entry point for the Lifeward section.

## Benefits

1. **Clear Entry Points**: New visitors immediately know where to start
2. **Better Onboarding**: Reduces decision paralysis for first-time readers
3. **Flexible**: Can be updated as content evolves
4. **Non-intrusive**: Existing articles and functionality remain unchanged

