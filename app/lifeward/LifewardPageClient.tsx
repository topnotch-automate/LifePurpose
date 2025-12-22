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

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return articles;
    return articles.filter((article) => article.category === selectedCategory);
  }, [articles, selectedCategory]);

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
            Lifeward is devoted to the <strong>daily practice</strong> of God's timeless principles.

            Here, faith is not abstract belief, but something lived and expressed through discipline, character, gratitude, prayer, health, and ordinary daily life.

            The aim is simple: to grow into a life that is more ordered, faithful, and abundant.
          </p>
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

