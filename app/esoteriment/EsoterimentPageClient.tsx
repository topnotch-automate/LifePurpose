"use client";

import { useState, useMemo } from "react";
import { ArticleCard } from "@/components/article/ArticleCard";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { Article } from "@/lib/types";

interface EsoterimentPageClientProps {
  articles: Article[];
  categories: string[];
}

export function EsoterimentPageClient({ articles, categories }: EsoterimentPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return articles;
    return articles.filter((article) => article.category === selectedCategory);
  }, [articles, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAFAF9] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <span className="text-sm font-medium uppercase tracking-wide text-[#7C8A9E] mb-4 inline-block">
            Esoteriment
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Understand the Unseen
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Esoteriment exists to bring clarity to what is often hidden or misunderstood.
            Here I simplify esoteric, metaphysical, and mystical ideas so they can be <strong>understood, tested, and lived.</strong>

            This work explores consciousness, mind, energy, symbolism, and the universal laws that quietly shape experience and reality.
          </p>
        </header>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Categories</h2>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            accentColor="#7C8A9E"
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

