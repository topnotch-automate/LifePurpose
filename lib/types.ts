export interface FunnelMetadata {
  book: string;
  ctaType?: "soft" | "standard";
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  category?: string;
  tags?: string[];
  section: "esoteriment" | "lifeward";
  readingTime?: number;
  content: string;
  funnel?: FunnelMetadata;
  image?: string;
  foundational?: boolean;
}

export interface Video {
  slug: string;
  title: string;
  description: string;
  platform: "youtube" | "tiktok" | "instagram" | "shorts";
  embedUrl: string;
  section: "esoteriment" | "lifeward";
  relatedArticle?: string;
  date: string;
  content: string;
  thumbnail?: string;
}

export interface Book {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  cover?: string;
  themes: string[];
  sampleChapter?: string;
  downloadLink?: string;
  purchaseLink?: string;
  purchaseUrl?: string;
  price?: number;
  currency?: string;
  status?: "free" | "paid" | "coming-soon";
  excerpt?: boolean;
  date: string;
}

