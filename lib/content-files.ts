import matter from "gray-matter";

export type ArticleSection = "esoteriment" | "lifeward";

export const ARTICLE_SECTIONS: ArticleSection[] = ["esoteriment", "lifeward"];

export const SECTION_LABELS: Record<ArticleSection, string> = {
  esoteriment: "Understanding",
  lifeward: "Practice",
};

export interface ArticleFunnel {
  book: string;
  ctaType?: "soft" | "standard";
}

export interface ArticleInput {
  title: string;
  description?: string;
  date?: string;
  section: ArticleSection;
  category?: string;
  tags?: string[];
  image?: string;
  foundational?: boolean;
  funnel?: ArticleFunnel;
  body: string;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSection(section: string): section is ArticleSection {
  return section === "esoteriment" || section === "lifeward";
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function getArticleCategories(section: ArticleSection): string[] {
  const base = ["Foundational", "Introductory"];

  if (section === "esoteriment") {
    return [...base, "Consciousness", "Mind", "Energy", "Symbolism", "Law"];
  }

  return [
    ...base,
    "Faith in Action",
    "Discipline & Character",
    "Gratitude & Prayer",
    "Health & Strength",
    "Daily Living",
  ];
}

export function extractDescription(content: string, maxLength = 160): string {
  const lines = content
    .trim()
    .split("\n")
    .filter((line) => line.trim());
  const firstParagraph =
    lines.find(
      (line) =>
        line.trim().length > 20 &&
        !line.startsWith("#") &&
        !line.startsWith(">") &&
        !line.match(/^[-*+]\s/)
    ) ||
    lines[0] ||
    "";

  let desc = firstParagraph.trim();
  desc = desc
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

  if (desc.length > maxLength) {
    desc = desc.substring(0, maxLength - 3) + "...";
  }
  return desc;
}

export function buildArticleMdx(input: ArticleInput): string {
  const body = input.body.trim();
  const frontmatter: Record<string, unknown> = {
    title: input.title.trim(),
    description: input.description?.trim() || extractDescription(body),
    date: input.date || new Date().toISOString().split("T")[0],
    section: input.section,
  };

  if (input.category?.trim()) {
    frontmatter.category = input.category.trim();
  }
  if (input.tags && input.tags.length > 0) {
    frontmatter.tags = input.tags.map((tag) => tag.trim()).filter(Boolean);
  }
  if (input.image?.trim()) {
    frontmatter.image = input.image.trim();
  }
  if (input.foundational) {
    frontmatter.foundational = true;
  }
  if (input.funnel?.book?.trim()) {
    frontmatter.funnel = {
      book: input.funnel.book.trim(),
      ...(input.funnel.ctaType && { ctaType: input.funnel.ctaType }),
    };
  }

  return matter.stringify(body ? `${body}\n` : "", frontmatter, {
    delimiters: "---",
    language: "yaml",
  });
}

export function parseArticleMdx(raw: string): ArticleInput & { slug?: string } {
  const { data, content } = matter(raw);
  const section = isValidSection(String(data.section || ""))
    ? (data.section as ArticleSection)
    : "esoteriment";

  return {
    title: String(data.title || ""),
    description: String(data.description || ""),
    date: String(data.date || ""),
    section,
    category: data.category ? String(data.category) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    image: data.image ? String(data.image) : undefined,
    foundational: Boolean(data.foundational),
    funnel: data.funnel
      ? {
          book: String(data.funnel.book || ""),
          ctaType: data.funnel.ctaType as "soft" | "standard" | undefined,
        }
      : undefined,
    body: content.trim(),
  };
}

export function validateArticleInput(
  input: ArticleInput,
  options?: { slug?: string; isUpdate?: boolean }
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!input.title?.trim()) {
    issues.push({ field: "title", message: "Title is required" });
  }

  if (!isValidSection(input.section)) {
    issues.push({ field: "section", message: "Section must be Understanding or Practice" });
  }

  const date = input.date || new Date().toISOString().split("T")[0];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    issues.push({ field: "date", message: "Date must be YYYY-MM-DD" });
  } else if (isNaN(new Date(date).getTime())) {
    issues.push({ field: "date", message: "Invalid date" });
  }

  if (options?.slug && !isValidSlug(options.slug)) {
    issues.push({ field: "slug", message: "Invalid slug" });
  }

  if (!options?.isUpdate && input.title?.trim()) {
    const slug = options?.slug || slugify(input.title);
    if (!isValidSlug(slug)) {
      issues.push({ field: "slug", message: "Title produces an invalid slug" });
    }
  }

  if (input.funnel?.book && !input.funnel.book.trim()) {
    issues.push({ field: "funnelBook", message: "Funnel book slug cannot be empty" });
  }

  return issues;
}

export function getArticleRelativePath(section: ArticleSection, slug: string): string {
  if (!isValidSection(section) || !isValidSlug(slug)) {
    throw new Error("Invalid section or slug");
  }
  return `content/${section}/${slug}.mdx`;
}

/** @deprecated Use buildArticleMdx — kept for CLI compatibility */
export function generateFrontmatter(
  type: "article" | "video" | "book",
  data: {
    title: string;
    section?: ArticleSection;
    description?: string;
    date?: string;
    category?: string;
    tags?: string[];
    image?: string;
    foundational?: boolean;
    funnel?: ArticleFunnel;
    platform?: string;
    embedUrl?: string;
    relatedArticle?: string;
    thumbnail?: string;
    subtitle?: string;
    themes?: string[];
    price?: number;
    currency?: string;
    status?: string;
    downloadLink?: string;
    purchaseLink?: string;
    purchaseUrl?: string;
    excerpt?: boolean;
    [key: string]: unknown;
  }
): string {
  if (type === "article") {
    return buildArticleMdx({
      title: data.title,
      description: data.description,
      date: data.date,
      section: data.section || "esoteriment",
      category: data.category,
      tags: data.tags,
      image: data.image,
      foundational: data.foundational,
      funnel: data.funnel,
      body: "",
    }).replace(/\n$/, "");
  }

  const baseFields = {
    title: data.title,
    description: data.description || "",
    date: data.date || new Date().toISOString().split("T")[0],
  };

  if (type === "video") {
    const lines = [
      "---",
      `title: "${baseFields.title}"`,
      `description: "${baseFields.description}"`,
      `date: "${baseFields.date}"`,
      `platform: "${data.platform || "youtube"}"`,
      `embedUrl: "${data.embedUrl || ""}"`,
      `section: "${data.section || "lifeward"}"`,
    ];
    if (data.relatedArticle) lines.push(`relatedArticle: "${data.relatedArticle}"`);
    if (data.thumbnail) lines.push(`thumbnail: "${data.thumbnail}"`);
    lines.push("---");
    return lines.join("\n") + "\n";
  }

  if (type === "book") {
    const lines = ["---", `title: "${baseFields.title}"`];
    if (data.subtitle) lines.push(`subtitle: "${data.subtitle}"`);
    lines.push(`description: "${baseFields.description}"`);
    lines.push(`date: "${baseFields.date}"`);
    if (data.cover) lines.push(`cover: "${data.cover}"`);
    if (data.themes && data.themes.length > 0) {
      lines.push(`themes: [${data.themes.map((t) => `"${t}"`).join(", ")}]`);
    }
    if (data.price !== undefined) lines.push(`price: ${data.price}`);
    if (data.currency) lines.push(`currency: "${data.currency}"`);
    if (data.status) lines.push(`status: "${data.status}"`);
    if (data.downloadLink) lines.push(`downloadLink: "${data.downloadLink}"`);
    if (data.purchaseLink) lines.push(`purchaseLink: "${data.purchaseLink}"`);
    if (data.purchaseUrl) lines.push(`purchaseUrl: "${data.purchaseUrl}"`);
    if (data.excerpt !== undefined) lines.push(`excerpt: ${data.excerpt}`);
    lines.push("---");
    return lines.join("\n") + "\n";
  }

  return `---\ntitle: "${baseFields.title}"\ndate: "${baseFields.date}"\n---\n`;
}
