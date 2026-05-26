export type LearnFilter = "all" | "understanding" | "practice" | "books" | "videos";

export const LEARN_FILTERS: LearnFilter[] = [
  "all",
  "understanding",
  "practice",
  "books",
  "videos",
];

export function parseLearnFilter(value: string | null | undefined): LearnFilter {
  if (value && LEARN_FILTERS.includes(value as LearnFilter) && value !== "all") {
    return value as LearnFilter;
  }
  return "all";
}

export function learnPageHref(filter: LearnFilter, query?: string): string {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("filter", filter);
  const q = query?.trim();
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/learn?${qs}` : "/learn";
}

/** @deprecated Use learnPageHref */
export function learnFilterHref(filter: LearnFilter): string {
  return learnPageHref(filter);
}

export type LearnItemType = "understanding" | "practice" | "book" | "video";

export interface LearnItem {
  id: string;
  type: LearnItemType;
  title: string;
  description: string;
  date: string;
  href: string;
  cover?: string;
  readingTime?: number;
  /** Lowercased plain text for article search (title, description, tags, body). */
  searchText?: string;
}

export function isArticleLearnItem(item: LearnItem): boolean {
  return item.type === "understanding" || item.type === "practice";
}

/** Strip markdown to plain text for indexing. */
export function plainTextFromMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function buildArticleSearchText(parts: {
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  content?: string;
}): string {
  return [
    parts.title,
    parts.description,
    parts.category,
    ...(parts.tags ?? []),
    parts.content ? plainTextFromMarkdown(parts.content) : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function matchesLearnSearch(item: LearnItem, query: string): boolean {
  if (!isArticleLearnItem(item)) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack =
    item.searchText ?? `${item.title} ${item.description}`.toLowerCase();

  if (haystack.includes(q)) return true;

  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return words.every((word) => haystack.includes(word));
  }

  return false;
}

export function filterLearnItemsWithSearch(
  items: LearnItem[],
  filter: LearnFilter,
  query: string
): LearnItem[] {
  const byFilter = filterLearnItems(items, filter);
  const q = query.trim();
  if (!q) return byFilter;

  if (filter === "books" || filter === "videos") {
    return [];
  }

  return byFilter.filter((item) => matchesLearnSearch(item, q));
}

export function filterLearnItems(items: LearnItem[], filter: LearnFilter): LearnItem[] {
  if (filter === "all") return items;
  if (filter === "understanding") return items.filter((i) => i.type === "understanding");
  if (filter === "practice") return items.filter((i) => i.type === "practice");
  if (filter === "books") return items.filter((i) => i.type === "book");
  return items.filter((i) => i.type === "video");
}

export function learnTypeLabel(type: LearnItemType): string {
  switch (type) {
    case "understanding":
      return "Understanding";
    case "practice":
      return "Practice";
    case "book":
      return "Book";
    case "video":
      return "Video";
  }
}
