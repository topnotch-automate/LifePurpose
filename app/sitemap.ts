import { MetadataRoute } from "next";
import { getAllArticles, getAllVideos, getAllBooks } from "@/lib/mdx";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  // Get all content
  const articles = getAllArticles();
  const videos = getAllVideos();
  const books = getAllBooks();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/work-with-me`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/start-here`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/course`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Article pages
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/${article.section}/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Video pages
  const videoPages: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${baseUrl}/videos/${video.slug}`,
    lastModified: new Date(video.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Book pages
  const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${baseUrl}/books/${book.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...videoPages, ...bookPages];
}

