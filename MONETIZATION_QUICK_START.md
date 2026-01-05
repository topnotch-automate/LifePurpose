# Monetization Quick Start

## Add Funnel to Article

Add this to any article's frontmatter:

```yaml
funnel:
  book: "quicken-your-manifestation"
  ctaType: "soft"
```

The soft CTA will appear at the end of the article automatically.

## Configure Book for Sale

Update book frontmatter:

```yaml
---
price: 9
currency: "USD"
status: "paid"
purchaseUrl: "/checkout/quicken-your-manifestation"
purchaseLink: "https://gumroad.com/l/quicken-manifestation"
---
```

## Set Up Email Capture

1. Choose email provider (ConvertKit recommended)
2. Add credentials to `.env.local`:
   ```
   CONVERTKIT_API_KEY=your_key
   CONVERTKIT_FORM_ID=your_form_id
   ```
3. Update `/app/api/email/subscribe/route.ts` with provider code

## Integrate Payment

1. Choose provider (Stripe recommended)
2. Create checkout session in `/app/checkout/[slug]/page.tsx`
3. Handle webhooks for payment confirmation
4. Deliver book to customer

## Example Files

- **Article with funnel**: `content/esoteriment/why-manifestation-fails.mdx`
- **Book with pricing**: `content/books/quicken-your-manifestation.mdx`

See `MONETIZATION_GUIDE.md` for full documentation.

