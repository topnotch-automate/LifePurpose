import { getAllArticles, getAllBooks, getAllVideos } from "@/lib/mdx";
import { resolveArticleImagePath } from "@/lib/article-image";
import { getVideoThumbnail } from "@/lib/video-embed";
import { buildArticleSearchText, type LearnItem } from "@/lib/learn-items";

export function getLearnItems(): LearnItem[] {
  const articles = getAllArticles();
  const books = getAllBooks();
  const videos = getAllVideos();

  const articleItems: LearnItem[] = articles.map((article) => ({
    id: `article-${article.section}-${article.slug}`,
    type: article.section === "esoteriment" ? "understanding" : "practice",
    title: article.title,
    description: article.description,
    date: article.date,
    href: `/${article.section}/${article.slug}`,
    cover: resolveArticleImagePath(article.image),
    readingTime: article.readingTime,
    searchText: buildArticleSearchText({
      title: article.title,
      description: article.description,
      category: article.category,
      tags: article.tags,
      content: article.content,
    }),
  }));

  const bookItems: LearnItem[] = books.map((book) => ({
    id: `book-${book.slug}`,
    type: "book",
    title: book.title,
    description: book.description,
    date: book.date,
    href: `/books/${book.slug}`,
    cover: book.cover,
  }));

  const videoItems: LearnItem[] = videos.map((video) => ({
    id: `video-${video.slug}`,
    type: "video",
    title: video.title,
    description: video.description,
    date: video.date,
    href: `/videos/${video.slug}`,
    cover: getVideoThumbnail(video.embedUrl, video.thumbnail),
    embedUrl: video.embedUrl,
  }));

  return [...articleItems, ...bookItems, ...videoItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
