import { Article, Video, Book } from "./types";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifeward.vercel.app";
const siteName = "Albert Blibo - Writer, Teacher, Guide";
const authorName = "Albert Blibo";
const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@albertblibo";

function getDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName,
      title: siteName,
      description: "I write to awaken clarity, discipline, and life. Explore Esoteriment and Lifeward.",
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

export function generateArticleMetadata(article: Article): Metadata {
  const sectionName = article.section.charAt(0).toUpperCase() + article.section.slice(1);
  const url = `${siteUrl}/${article.section}/${article.slug}`;
  const imageUrl = article.image || `${siteUrl}/og-image.png`;

  return {
    ...getDefaultMetadata(),
    title: `${article.title} | ${sectionName}`,
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
    title: `${video.title} | Videos`,
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
    title: `${book.title} | Books`,
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
      image: article.image || `${baseUrl}/og-image.png`,
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

