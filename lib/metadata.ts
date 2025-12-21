import { Article, Video, Book } from "./types";

export function generateArticleMetadata(article: Article) {
  return {
    title: `${article.title} | ${article.section.charAt(0).toUpperCase() + article.section.slice(1)}`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      tags: article.tags,
    },
  };
}

export function generateVideoMetadata(video: Video) {
  return {
    title: `${video.title} | Videos`,
    description: video.description,
    openGraph: {
      title: video.title,
      description: video.description,
      type: "video.other",
    },
  };
}

export function generateBookMetadata(book: Book) {
  return {
    title: `${book.title} | Books`,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description,
      type: "book",
    },
  };
}

