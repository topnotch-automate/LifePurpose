import { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { MarkdownContent } from "./MarkdownContent";
import { ReadingProgress } from "./ReadingProgress";
import { ShareButtons } from "./ShareButtons";
import { RelatedArticles } from "./RelatedArticles";
import { LikeButton } from "./LikeButton";
import { CommentsSection } from "./CommentsSection";
import { FunnelCTA } from "@/components/funnel/FunnelCTA";
import { getAllArticles } from "@/lib/mdx";

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  const sectionColor = article.section === "esoteriment" ? "text-[#7C8A9E]" : "text-[#9A7B4F]";
  const sectionBg = article.section === "esoteriment" ? "bg-[#FAFAF9]" : "bg-[#FFFDF8]";
  const sectionBgAlt = article.section === "esoteriment" ? "bg-[#F5F4F2]" : "bg-[#FDF9F3]";
  const allArticles = getAllArticles();
  const articleUrl = `/${article.section}/${article.slug}`;
  
  return (
    <article className={`min-h-screen ${sectionBg} py-12 relative`}>
      <ReadingProgress />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`text-sm font-medium uppercase tracking-wide ${sectionColor}`}>
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
            {article.readingTime && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-600">{article.readingTime} min read</span>
              </>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {article.description}
          </p>
          
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        
        <ShareButtons title={article.title} url={articleUrl} description={article.description} />
        
        <div className="prose prose-lg max-w-none article-content bg-white rounded-lg p-8 md:p-12 shadow-sm">
          <MarkdownContent content={article.content} />
        </div>

        {article.funnel && (
          <FunnelCTA funnel={article.funnel} />
        )}

        <ShareButtons title={article.title} url={articleUrl} description={article.description} />
        
        <div className="flex items-center gap-4 mt-8">
          <LikeButton contentType="article" contentId={article.slug} section={article.section} />
        </div>

        <CommentsSection contentType="article" contentId={article.slug} />
        
        <RelatedArticles currentArticle={article} articles={allArticles} />
      </div>
    </article>
  );
}

