import { ArticleCard } from "@/components/article/ArticleCard";
import { getArticleSlugs, getArticleBySlug } from "@/lib/mdx";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lifeward - Live the Truth",
  description: "Practical application of God's timeless principles for an abundant life. Faith in action, discipline, character, gratitude, and daily living.",
};

export default function LifewardPage() {
  const slugs = getArticleSlugs("lifeward");
  const articles = slugs
    .map((slug) => getArticleBySlug("lifeward", slug))
    .filter((article) => article !== null)
    .sort((a, b) => {
      if (!a || !b) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <span className="text-sm font-medium uppercase tracking-wide text-[#9A7B4F] mb-4 inline-block">
            Lifeward
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Live the Truth
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Practical application of God's timeless principles for an abundant life. 
            Faith in action, discipline, character, gratitude, prayer, health, 
            and daily living.
          </p>
        </header>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {["Faith in Action", "Discipline & Character", "Gratitude & Prayer", "Health & Strength", "Daily Living"].map((category) => (
              <span
                key={category}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-[#9A7B4F] transition-colors cursor-pointer"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              article && <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
            <p className="text-lg">Teachings coming soon...</p>
            <p className="mt-2 text-sm">Discover how to live the truth daily.</p>
          </div>
        )}
      </div>
    </div>
  );
}

