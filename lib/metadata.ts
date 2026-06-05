import { Article, Video, Book } from "./types";
import type { Metadata } from "next";
import { getAbsoluteArticleImageUrl } from "./article-image";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://albertblibo.com";
const siteName = "Lifeward Coaching Inc.";
const siteDescription =
  "Lifeward Coaching helps you discover true identity and live from alignment through timeless spiritual truth and daily practice.";
const authorName = "Albert Blibo";
const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@TheAlbertBlibo";
const defaultOgImage = `${siteUrl}/og-image.png`;

function pageUrl(path: string): string {
  return path === "/" ? siteUrl : `${siteUrl}${path}`;
}

function getDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName,
      title: siteName,
      description: siteDescription,
    },
    twitter: {
      card: "summary_large_image",
      creator: twitterHandle,
      site: twitterHandle,
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
  };
}

export function generatePageMetadata({
  path,
  title,
  description,
  ogImage = defaultOgImage,
}: {
  path: string;
  title: string | { absolute: string };
  description: string;
  ogImage?: string;
}): Metadata {
  const resolvedTitle = typeof title === "string" ? title : title.absolute;
  const url = pageUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName,
      title: resolvedTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      creator: twitterHandle,
      site: twitterHandle,
      images: [ogImage],
    },
  };
}

export function generateArticleMetadata(article: Article): Metadata {
  const url = `${siteUrl}/${article.section}/${article.slug}`;
  const imageUrl =
    getAbsoluteArticleImageUrl(article.image) || `${siteUrl}/og-image.png`;

  return {
    ...getDefaultMetadata(),
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/${article.section}/${article.slug}`,
    },
    openGraph: {
      ...getDefaultMetadata().openGraph,
      type: "article",
      url,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      authors: [authorName],
      tags: article.tags || [],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      ...getDefaultMetadata().twitter,
      title: article.title,
      description: article.description,
      images: [imageUrl],
    },
    keywords: article.tags || [],
  };
}

export function generateVideoMetadata(video: Video): Metadata {
  const url = `${siteUrl}/videos/${video.slug}`;
  const imageUrl = video.thumbnail || `${siteUrl}/og-image.png`;

  return {
    ...getDefaultMetadata(),
    title: video.title,
    description: video.description,
    alternates: {
      canonical: `/videos/${video.slug}`,
    },
    openGraph: {
      ...getDefaultMetadata().openGraph,
      type: "video.other",
      url,
      title: video.title,
      description: video.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: video.title,
        },
      ],
    },
    twitter: {
      ...getDefaultMetadata().twitter,
      card: "summary_large_image",
      title: video.title,
      description: video.description,
      images: [imageUrl],
    },
  };
}

export function generateBookMetadata(book: Book): Metadata {
  const url = `${siteUrl}/books/${book.slug}`;
  const imageUrl = book.cover || `${siteUrl}/og-image.png`;

  return {
    ...getDefaultMetadata(),
    title: book.title,
    description: book.description,
    alternates: {
      canonical: `/books/${book.slug}`,
    },
    openGraph: {
      ...getDefaultMetadata().openGraph,
      type: "book",
      url,
      title: book.title,
      description: book.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1600,
          alt: book.title,
        },
      ],
    },
    twitter: {
      ...getDefaultMetadata().twitter,
      title: book.title,
      description: book.description,
      images: [imageUrl],
    },
    keywords: book.themes || [],
  };
}

export function generateStructuredData(type: "Article" | "Video" | "Book", data: Article | Video | Book) {
  const baseUrl = siteUrl;
  
  if (type === "Article") {
    const article = data as Article;
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      image: getAbsoluteArticleImageUrl(article.image) || `${baseUrl}/og-image.png`,
      datePublished: article.date,
      dateModified: article.date,
      author: {
        "@type": "Person",
        name: authorName,
      },
      publisher: {
        "@type": "Organization",
        name: siteName,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}/${article.section}/${article.slug}`,
      },
      keywords: article.tags?.join(", ") || "",
    };
  }
  
  if (type === "Video") {
    const video = data as Video;
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnail || `${baseUrl}/og-image.png`,
      uploadDate: video.date,
      contentUrl: video.embedUrl,
      embedUrl: video.embedUrl,
    };
  }
  
  if (type === "Book") {
    const book = data as Book;
    return {
      "@context": "https://schema.org",
      "@type": "Book",
      name: book.title,
      description: book.description,
      image: book.cover || `${baseUrl}/og-image.png`,
      author: {
        "@type": "Person",
        name: authorName,
      },
      publisher: {
        "@type": "Organization",
        name: siteName,
      },
      ...(book.price && { offers: { "@type": "Offer", price: book.price, priceCurrency: "USD" } }),
    };
  }
  
  return null;
}

