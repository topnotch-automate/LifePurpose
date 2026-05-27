import fs from "fs";
import path from "path";
import {
  ArticleInput,
  ArticleSection,
  buildArticleMdx,
  getArticleRelativePath,
  isValidSection,
  isValidSlug,
  parseArticleMdx,
} from "./content-files";
import { getGitHubFile, isGitHubConfigured, putGitHubFile } from "./github-content";
import { getAllArticles, getArticleBySlug } from "./mdx";

export type ContentSaveBackend = "local" | "github";

export interface ArticleListItem {
  slug: string;
  title: string;
  section: ArticleSection;
  date: string;
  description: string;
  category?: string;
}

export interface ArticleDetail extends ArticleInput {
  slug: string;
}

function useGitHubForWrites(): boolean {
  if (isGitHubConfigured()) {
    return true;
  }
  if (process.env.NODE_ENV === "development") {
    return false;
  }
  throw new Error(
    "Content publishing requires GITHUB_TOKEN and GITHUB_REPO in production. See .env.example."
  );
}

export function listArticles(): ArticleListItem[] {
  return getAllArticles().map((article) => ({
    slug: article.slug,
    title: article.title,
    section: article.section,
    date: article.date,
    description: article.description,
    category: article.category,
  }));
}

export function getArticle(section: ArticleSection, slug: string): ArticleDetail | null {
  if (!isValidSection(section) || !isValidSlug(slug)) {
    return null;
  }

  const article = getArticleBySlug(section, slug);
  if (!article) {
    return null;
  }

  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    date: article.date.split("T")[0],
    section: article.section,
    category: article.category,
    tags: article.tags || [],
    image: article.image,
    foundational: article.foundational,
    funnel: article.funnel,
    body: article.content,
  };
}

export async function createArticle(
  slug: string,
  input: ArticleInput
): Promise<{ backend: ContentSaveBackend; path: string }> {
  if (!isValidSlug(slug)) {
    throw new Error("Invalid slug");
  }

  const relativePath = getArticleRelativePath(input.section, slug);
  const mdxContent = buildArticleMdx(input);

  if (useGitHubForWrites()) {
    const existing = await getGitHubFile(relativePath);
    if (existing) {
      throw new Error("An article with this slug already exists");
    }

    await putGitHubFile(relativePath, mdxContent, `Create article: ${input.title}`);
    return { backend: "github", path: relativePath };
  }

  const fullPath = path.join(process.cwd(), relativePath);
  if (fs.existsSync(fullPath)) {
    throw new Error("An article with this slug already exists");
  }

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, mdxContent, "utf8");
  return { backend: "local", path: relativePath };
}

export async function updateArticle(
  section: ArticleSection,
  slug: string,
  input: ArticleInput
): Promise<{ backend: ContentSaveBackend; path: string }> {
  if (!isValidSection(section) || !isValidSlug(slug)) {
    throw new Error("Invalid section or slug");
  }

  if (input.section !== section) {
    throw new Error("Cannot move articles between sections in the editor yet");
  }

  const relativePath = getArticleRelativePath(section, slug);
  const mdxContent = buildArticleMdx(input);

  if (useGitHubForWrites()) {
    const existing = await getGitHubFile(relativePath);
    if (!existing) {
      throw new Error("Article not found");
    }

    await putGitHubFile(
      relativePath,
      mdxContent,
      `Update article: ${input.title}`,
      existing.sha
    );
    return { backend: "github", path: relativePath };
  }

  const fullPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error("Article not found");
  }

  fs.writeFileSync(fullPath, mdxContent, "utf8");
  return { backend: "local", path: relativePath };
}

export function getRawArticleMdx(section: ArticleSection, slug: string): string | null {
  if (!isValidSection(section) || !isValidSlug(slug)) {
    return null;
  }

  const fullPath = path.join(process.cwd(), getArticleRelativePath(section, slug));
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  return fs.readFileSync(fullPath, "utf8");
}

export { parseArticleMdx };
