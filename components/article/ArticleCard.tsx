import Link from "next/link";
import { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const sectionColor = article.section === "esoteriment" ? "text-[#7C8A9E]" : "text-[#9A7B4F]";
  
  return (
    <Link
      href={`/${article.section}/${article.slug}`}
      className={cn(
        "block group transition-all duration-200",
        featured ? "md:col-span-2" : ""
      )}
    >
      <article className="h-full bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <span className={cn("text-sm font-medium uppercase tracking-wide", sectionColor)}>
            {article.section}
          </span>
          {article.category && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">{article.category}</span>
            </>
          )}
          <span className="text-gray-300">•</span>
          <time className="text-sm text-gray-600">{formatDate(article.date)}</time>
        </div>
        
        <h2 className="text-xl md:text-2xl font-serif font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
          {article.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.description}
        </p>
        
        {article.readingTime && (
          <div className="flex items-center text-sm text-gray-500">
            <span>{article.readingTime} min read</span>
          </div>
        )}
      </article>
    </Link>
  );
}

