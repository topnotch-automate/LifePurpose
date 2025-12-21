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
}

export interface Book {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  themes: string[];
  sampleChapter?: string;
  downloadLink?: string;
  purchaseLink?: string;
  date: string;
}

