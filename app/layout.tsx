import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

const cinzel = Cinzel({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://albertblibo.com";
const siteName = "Lifeward Coaching Inc.";
const siteDescription =
  "Lifeward Coaching helps you discover true identity and live from alignment through timeless spiritual truth and daily practice.";
const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@TheAlbertBlibo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "lifeward",
    "lifeward coaching",
    "identity alignment",
    "spiritual truth",
    "daily practice",
    "faith and discipline",
    "LIAM framework",
    "Christian transformation",
  ],
  authors: [{ name: "Albert Blibo" }],
  creator: "Albert Blibo",
  publisher: "Albert Blibo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    creator: twitterHandle,
    site: twitterHandle,
    images: [`${siteUrl}/og-image.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    types: {
      "application/rss+xml": [{ url: `${siteUrl}/rss`, title: `${siteName} RSS Feed` }],
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${cinzel.variable} ${cormorant.variable} antialiased min-h-screen flex flex-col bg-[var(--cream)] text-[var(--charcoal)]`}
      >
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}
