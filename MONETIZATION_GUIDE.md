# Monetization Features Guide

This guide explains the monetization system integrated into your author platform, designed to be **ethical, spiritually-aligned, and non-manipulative**.

## Overview

The monetization system follows the principle: **Value → Trust → Exchange**

Money becomes a byproduct of usefulness, not the primary goal.

---

## Features Implemented

### 1. Article-to-Book Funnel

Articles can now link to books through a soft, elegant call-to-action.

#### How It Works

Add `funnel` metadata to any article's frontmatter:

```yaml
---
title: "Why Manifestation Techniques Fail"
funnel:
  book: "quicken-your-manifestation"
  ctaType: "soft"
---
```

The `FunnelCTA` component automatically appears at the end of the article, offering a gentle invitation to explore the related book.

#### Example Article

See `content/esoteriment/why-manifestation-fails.mdx` for a complete example.

### 2. Enhanced Book Pages

Book pages now support:

- **Pricing**: Set `price` and `currency` in frontmatter
- **Status**: `free`, `paid`, or `coming-soon`
- **Purchase URLs**: Internal (`purchaseUrl`) or external (`purchaseLink`)
- **Subtitle**: Optional subtitle for better positioning
- **Email Capture**: Integrated email subscription for free resources

#### Book Frontmatter Example

```yaml
---
slug: "quicken-your-manifestation"
title: "Quicken Your Manifestation"
subtitle: "How to Remain Faithful Unto Death"
price: 9
currency: "USD"
status: "paid"
purchaseUrl: "/checkout/quicken-your-manifestation"
purchaseLink: "https://gumroad.com/l/quicken-manifestation"
---
```

### 3. Email Capture System

Books can offer a free companion resource in exchange for email subscription.

#### Features

- **Non-intrusive**: Appears only on book pages
- **Value-first**: Offers something meaningful (companion reflection, free chapter)
- **Clean UI**: Matches your site's calm aesthetic
- **Future-ready**: Ready for ConvertKit, Buttondown, or Resend integration

#### Implementation

The `BookEmailCapture` component is automatically included on book pages. Subscriptions are handled via `/api/email/subscribe`.

**Current Status**: Logs subscriptions (for development). To go live:
1. Choose an email provider (ConvertKit recommended)
2. Add API credentials to `.env.local`
3. Update `/app/api/email/subscribe/route.ts`

### 4. Checkout Pages

Basic checkout page structure at `/checkout/[slug]` for future payment integration.

**Current Status**: Placeholder page with integration guidance.

**Next Steps**: Integrate with:
- **Stripe** (recommended for full control)
- **Gumroad** (quick start for digital products)
- **Lemon Squeezy** (all-in-one solution)

---

## Content Strategy

### The Funnel Flow

1. **Free Articles** → Provide value, build trust
2. **Soft CTA** → Gentle invitation to go deeper
3. **Book Page** → Clear promise, sample chapter
4. **Email Capture** → Free resource, ongoing relationship
5. **Purchase** → Exchange for deeper content

### Principles

- **No manipulation**: Truth first, exchange second
- **No pressure**: Optional, respectful invitations
- **Value alignment**: Paid content offers coherence, not just information
- **Spiritual integrity**: Nothing essential is locked

---

## Technical Details

### Type Definitions

```typescript
// Article funnel metadata
interface FunnelMetadata {
  book: string;           // Book slug
  ctaType?: "soft" | "standard";
}

// Enhanced Book interface
interface Book {
  price?: number;
  currency?: string;
  status?: "free" | "paid" | "coming-soon";
  purchaseUrl?: string;   // Internal checkout
  purchaseLink?: string;  // External purchase
  subtitle?: string;
  // ... other fields
}
```

### Components

- **`FunnelCTA`**: Soft call-to-action at end of articles
- **`BookEmailCapture`**: Email subscription form on book pages
- **`ArticleContent`**: Automatically displays FunnelCTA when `funnel` metadata exists

### API Routes

- **`/api/email/subscribe`**: Handles email subscriptions (ready for provider integration)

---

## Next Steps

### Immediate Actions

1. **Create articles with funnel metadata** linking to your first book
2. **Set up email provider** (ConvertKit recommended)
3. **Choose payment provider** (Stripe recommended)
4. **Create free resource** (companion reflection, free chapter)

### Future Enhancements

- **Membership system**: "The Inner Ward" with exclusive content
- **Study paths**: Structured paid teachings
- **Bundle offers**: Esoteriment Pack, Lifeward Pack
- **Access control**: Gated content for paid members
- **Analytics**: Track funnel performance

---

## Example Workflow

1. Write article: "Why Manifestation Techniques Fail"
2. Add `funnel.book: "quicken-your-manifestation"` to frontmatter
3. Reader finishes article → sees soft CTA
4. Clicks through → lands on book page
5. Reads sample chapter → subscribes for free resource
6. Receives email → builds relationship
7. Purchases book → deeper content

---

## Philosophy

This system is designed to:

- **Respect autonomy**: No popups, no pressure
- **Honor intelligence**: Clear value proposition
- **Build trust**: Free content first, paid content as depth
- **Maintain integrity**: Spiritual alignment, not manipulation

Money flows as **exchange**, not extraction.

---

## Support

For questions or issues:
1. Check component documentation
2. Review example files in `content/`
3. See API route comments for integration steps

