import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { Article, Video, Book, Practice } from "./types";

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
    funnel: data.funnel || undefined,
    image: data.image,
    foundational: data.foundational || false,
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
    thumbnail: data.thumbnail,
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
    subtitle: data.subtitle,
    description: data.description || "",
    cover: data.cover,
    themes: data.themes || [],
    sampleChapter: data.sampleChapter,
    downloadLink: data.downloadLink,
    purchaseLink: data.purchaseLink,
    purchaseUrl: data.purchaseUrl,
    price: data.price,
    currency: data.currency || "USD",
    status: data.status || "free",
    excerpt: data.excerpt,
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

/**
 * Get foundational messages for a specific section
 * Foundational messages are articles marked with foundational: true
 */
export function getFoundationalMessages(section: "esoteriment" | "lifeward"): Article[] {
  const allArticles = getAllArticles(section);
  return allArticles
    .filter((article) => article.foundational === true)
    .sort((a, b) => {
      // Sort by date (newest first), but you could also sort by a priority field if added later
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

/**
 * Get the first foundational message for a section (used for CTAs)
 */
export function getFirstFoundationalMessage(section: "esoteriment" | "lifeward"): Article | null {
  const foundational = getFoundationalMessages(section);
  return foundational.length > 0 ? foundational[0] : null;
}

/**
 * Get all practice slugs
 */
export function getPracticeSlugs(): string[] {
  const fullPath = path.join(contentDirectory, "lifeward", "practices");
  if (!fs.existsSync(fullPath)) return [];
  
  return fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Get a practice by its ID
 */
export function getPracticeById(id: string): Practice | null {
  const fullPath = path.join(contentDirectory, "lifeward", "practices", `${id}.mdx`);
  
  if (!fs.existsSync(fullPath)) return null;
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  
  // Parse content into sections (split by ## headers)
  const sections = content.split(/^##\s+/m).map(s => s.trim()).filter(s => s);
  
  let orientation = "";
  let practiceText = "";
  let livingIntegration = "";
  let quietReminder = "";
  
  for (const section of sections) {
    const lines = section.split("\n");
    const header = lines[0]?.trim() || "";
    const body = lines.slice(1).join("\n").trim();
    
    if (header === "Orientation") {
      orientation = body;
    } else if (header === "Practice") {
      practiceText = body;
    } else if (header === "LivingIntegration") {
      livingIntegration = body;
    } else if (header === "QuietReminder") {
      quietReminder = body;
    }
  }
  
  if (!orientation || !practiceText) return null; // Invalid practice
  
  return {
    id: data.id || id,
    theme: data.theme || "",
    source: data.source || "",
    sourceSlug: data.sourceSlug || undefined,
    depth: (data.depth as "Gentle" | "Reflective" | "Integrative") || "Gentle",
    orientation,
    practice: practiceText,
    livingIntegration,
    quietReminder,
  };
}

/**
 * Check if a practice's source article exists
 */
function doesSourceArticleExist(practice: Practice): boolean {
  // If sourceSlug is provided, do exact match first
  if (practice.sourceSlug) {
    const article = getArticleBySlug("esoteriment", practice.sourceSlug);
    return article !== null;
  }
  
  // Otherwise, try to match by source string
  const source = practice.source;
  if (!source) return false;
  
  // Extract the article reference from source (e.g., "Esoteriment – The Identity" -> "The Identity")
  const articleRef = source.replace(/^Esoteriment\s*–\s*/i, "").trim();
  if (!articleRef) return false;
  
  // Get all esoteriment articles
  const esoterimentArticles = getAllArticles("esoteriment");
  
  if (esoterimentArticles.length === 0) return false;
  
  // Check if any article title matches the reference
  // We look for meaningful keyword matches (words longer than 3 characters)
  const normalizedRef = articleRef.toLowerCase();
  const refWords = normalizedRef.split(/\s+/).filter(word => word.length > 3);
  
  if (refWords.length === 0) return false;
  
  return esoterimentArticles.some((article) => {
    const normalizedTitle = article.title.toLowerCase();
    // Check if all significant words from the reference appear in the title
    // This ensures a meaningful match (e.g., "The Identity" matches articles with "Identity" in title)
    return refWords.every(word => normalizedTitle.includes(word)) ||
           // Or if the full reference appears in the title
           normalizedTitle.includes(normalizedRef);
  });
}

/**
 * Get all practices (only those whose source articles exist)
 */
export function getAllPractices(): Practice[] {
  const slugs = getPracticeSlugs();
  return slugs
    .map((slug) => getPracticeById(slug))
    .filter((practice): practice is Practice => practice !== null)
    .filter((practice) => doesSourceArticleExist(practice));
}

/**
 * Get daily practice (date-based seed for consistency)
 */
export function getDailyPractice(theme?: string): Practice | null {
  const allPractices = getAllPractices();
  
  let practices = allPractices;
  if (theme) {
    practices = allPractices.filter((p) => p.theme === theme);
  }
  
  if (practices.length === 0) return null;
  
  // Date-based seed for consistency (same practice all day)
  const today = new Date().toISOString().split("T")[0];
  const seed = today.split("-").join("");
  const index = Number(seed) % practices.length;
  
  return practices[index];
}

