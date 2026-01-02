# Lifeward Coaching Website

A coaching and teaching platform built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys (optional for local dev)
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
lifeward-site/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── contact/       # Contact form endpoint
│   │   └── booking/       # Booking intake endpoint
│   ├── coaching/          # Coaching page (production copy)
│   ├── sessions/          # Sessions page with booking
│   ├── start-here/        # Guided entry page
│   ├── events/            # Events & gatherings
│   ├── library/           # Written teachings
│   ├── about/            # About page
│   ├── contact/           # Contact form
│   └── page.tsx           # Home page
├── components/
│   ├── booking/          # Booking widget
│   ├── layout/           # Navigation, Footer
│   └── ui/               # Reusable UI components
├── lib/
│   ├── config.ts         # Configuration with fallbacks
│   ├── email.ts          # Email service (Resend)
│   └── validation.ts     # Form validation schemas
└── public/               # Static assets
```

## Design System

The site follows a calm, minimal design with:

- **Colors**: Warm earth tones (#8B7355 accent, #FAFAF9 background)
- **Typography**: Crimson Pro (serif) for headings, Inter (sans-serif) for body
- **Spacing**: 4px base unit system
- **Max Width**: 65ch for reading, 1200px for containers

## Features

- ✅ All core pages implemented
- ✅ Production-ready copy for Coaching and Sessions pages
- ✅ Responsive design (mobile-first)
- ✅ SEO metadata and sitemap
- ✅ Accessibility considerations
- ✅ Clean, minimal navigation
- ✅ **Email service integration (Resend) with fallbacks**
- ✅ **Booking system (Cal.com/Calendly) with fallbacks**
- ✅ **Contact form with API integration**
- ✅ **Booking intake form**

## Integrations

The site includes production-ready integrations that work gracefully without dependencies:

- **Email Service**: Resend integration with console fallback in development
- **Booking System**: Cal.com or Calendly support with custom intake form fallback
- **Form Validation**: Zod schemas for all forms
- **Error Handling**: Graceful degradation when services aren't configured

See [INTEGRATIONS.md](./INTEGRATIONS.md) for detailed setup instructions.

## Local Development

The site works **without any external services** configured:

- Forms submit successfully (emails logged to console)
- Booking shows custom intake form
- All features function with fallbacks

To enable production services, add API keys to `.env.local` (see `.env.example`).

## Build

```bash
npm run build
```

## Deploy

The site is ready to deploy to Vercel:

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables

Set these in your hosting platform:

**Required:**
- `NEXT_PUBLIC_SITE_URL` - Your production URL

**Optional (with fallbacks):**
- `RESEND_API_KEY` - For email service
- `NEXT_PUBLIC_CALCOM_USERNAME` - For Cal.com booking
- `NEXT_PUBLIC_CALENDLY_USERNAME` - For Calendly booking

See `.env.example` for all available variables.
