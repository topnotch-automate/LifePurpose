import Link from "next/link";
import { Article } from "@/lib/types";
import { cn } from "@/lib/utils";

function sectionTag(section: Article["section"]) {
  return section === "esoteriment" ? "Understanding" : "Practice";
}

interface LearnArticleCardProps {
  article: Article;
}

export function LearnArticleCard({ article }: LearnArticleCardProps) {
  const tag = sectionTag(article.section);

  return (
    <Link
      href={`/${article.section}/${article.slug}`}
      className="group block h-full rounded-2xl border border-[var(--light)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <span
        className={cn(
          "inline-block font-[family-name:var(--font-label)] text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded mb-4",
          article.section === "esoteriment"
            ? "bg-[var(--sky)] text-[var(--royal)]"
            : "bg-[var(--cream)] text-[var(--navy)]"
        )}
      >
        {tag}
      </span>
      <h2 className="font-medium text-[var(--charcoal)] mb-2 group-hover:text-[var(--royal)] transition-colors">
        {article.title}
      </h2>
      <p className="text-sm text-[var(--mid)] line-clamp-2 mb-4">{article.description}</p>
      {article.readingTime && (
        <span className="text-xs text-[var(--mid)]">{article.readingTime} min read</span>
      )}
    </Link>
  );
}
