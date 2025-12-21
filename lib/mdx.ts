import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { Article, Video, Book } from "./types";

const contentDirectory = path.join(process.cwd(), "content");

export function getArticleSlugs(section: "esoteriment" | "lifeward"): string[] {
  const fullPath = path.join(contentDirectory, section);
  if (!fs.existsSync(fullPath)) return [];
  
  return fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getArticleBySlug(
  section: "esoteriment" | "lifeward",
  slug: string
): Article | null {
  const fullPath = path.join(contentDirectory, section, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) return null;
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    category: data.category,
    tags: data.tags || [],
    section,
    readingTime: Math.ceil(stats.minutes),
    content,
  };
}

export function getAllArticles(section?: "esoteriment" | "lifeward"): Article[] {
  const sections: ("esoteriment" | "lifeward")[] = section ? [section] : ["esoteriment", "lifeward"];
  const articles: Article[] = [];

  for (const sec of sections) {
    const slugs = getArticleSlugs(sec);
    const sectionArticles = slugs
      .map((slug) => getArticleBySlug(sec, slug))
      .filter((article): article is Article => article !== null);
    articles.push(...sectionArticles);
  }

  return articles.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getVideoSlugs(): string[] {
  const fullPath = path.join(contentDirectory, "videos");
  if (!fs.existsSync(fullPath)) return [];
  
  return fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getVideoBySlug(slug: string): Video | null {
  const fullPath = path.join(contentDirectory, "videos", `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) return null;
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    platform: data.platform || "youtube",
    embedUrl: data.embedUrl || "",
    section: data.section || "lifeward",
    relatedArticle: data.relatedArticle,
    date: data.date || new Date().toISOString(),
    content,
  };
}

export function getAllVideos(): Video[] {
  const slugs = getVideoSlugs();
  return slugs
    .map((slug) => getVideoBySlug(slug))
    .filter((video): video is Video => video !== null)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getBookSlugs(): string[] {
  const fullPath = path.join(contentDirectory, "books");
  if (!fs.existsSync(fullPath)) return [];
  
  return fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getBookBySlug(slug: string): Book | null {
  const fullPath = path.join(contentDirectory, "books", `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) return null;
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);

  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    cover: data.cover,
    themes: data.themes || [],
    sampleChapter: data.sampleChapter,
    downloadLink: data.downloadLink,
    purchaseLink: data.purchaseLink,
    date: data.date || new Date().toISOString(),
  };
}

export function getAllBooks(): Book[] {
  const slugs = getBookSlugs();
  return slugs
    .map((slug) => getBookBySlug(slug))
    .filter((book): book is Book => book !== null)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

