import Link from "next/link";
import { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RelatedArticlesProps {
  currentArticle: Article;
  articles: Article[];
  maxItems?: number;
}

export function RelatedArticles({ currentArticle, articles, maxItems = 3 }: RelatedArticlesProps) {
  // Filter out current article and get related articles (same section or same category/tags)
  const related = articles
    .filter(
      (article) =>
        article.slug !== currentArticle.slug &&
        (article.section === currentArticle.section ||
          article.category === currentArticle.category ||
          article.tags?.some((tag) => currentArticle.tags?.includes(tag)))
    )
    .slice(0, maxItems);

  if (related.length === 0) {
    // Fallback to any articles from same section
    const fallback = articles
      .filter((article) => article.slug !== currentArticle.slug && article.section === currentArticle.section)
      .slice(0, maxItems);
    
    if (fallback.length === 0) return null;
    
    return (
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Continue Reading</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {fallback.map((article) => (
            <ArticlePreview key={article.slug} article={article} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Articles</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {related.map((article) => (
          <ArticlePreview key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}

function ArticlePreview({ article }: { article: Article }) {
  const sectionColor = article.section === "esoteriment" ? "text-[#7C8A9E]" : "text-[#9A7B4F]";
  
  return (
    <Link href={`/${article.section}/${article.slug}`} className="block group">
      <article className="h-full p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("text-xs font-medium uppercase tracking-wide", sectionColor)}>
            {article.section}
          </span>
          {article.readingTime && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">{article.readingTime} min</span>
            </>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
        <time className="text-xs text-gray-500 mt-2 block">{formatDate(article.date)}</time>
      </article>
    </Link>
  );
}

