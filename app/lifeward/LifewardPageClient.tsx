"use client";

import { useState, useMemo } from "react";
import { ArticleCard } from "@/components/article/ArticleCard";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { Article } from "@/lib/types";

interface LifewardPageClientProps {
  articles: Article[];
  categories: string[];
}

export function LifewardPageClient({ articles, categories }: LifewardPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return articles;
    return articles.filter((article) => article.category === selectedCategory);
  }, [articles, selectedCategory]);

  const handlePracticeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowComingSoon(true);
    // Auto-hide after 5 seconds
    setTimeout(() => setShowComingSoon(false), 5000);
  };

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
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">
            Lifeward is devoted to the <strong>daily practice</strong> of God&apos;s timeless principles.

            Here, faith is not abstract belief, but something lived and expressed through discipline, character, gratitude, prayer, health, and ordinary daily life.

            The aim is simple: to grow into a life that is more ordered, faithful, and abundant.
          </p>
          <div className="relative inline-block">
            <button
              onClick={handlePracticeClick}
              onMouseEnter={() => setShowComingSoon(true)}
              onMouseLeave={() => setShowComingSoon(false)}
              className="inline-block px-6 py-3 bg-[#9A7B4F] text-white font-medium rounded-md hover:bg-[#8B7355] transition-colors cursor-pointer"
              aria-label="Daily Practice - Coming Soon"
            >
              Daily Practice
            </button>
            {showComingSoon && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                <p className="text-sm font-medium text-gray-900 mb-2">Coming Soon</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The Daily Practice feature is in development. In the meantime, continue reading and anticipate this powerful tool for your daily journey.
                </p>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Categories</h2>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            accentColor="#9A7B4F"
          />
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
            <p className="text-lg">No articles found in this category...</p>
            <p className="mt-2 text-sm">Explore other categories or check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

