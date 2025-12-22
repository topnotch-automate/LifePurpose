import { ArticleCard } from "@/components/article/ArticleCard";
import { getArticleSlugs, getArticleBySlug } from "@/lib/mdx";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Esoteriment - Understand the Unseen",
  description: "Esoteriment exists to bring clarity to what is often hidden or misunderstood. Here I simplify esoteric, metaphysical, and mystical ideas so they can be understood, tested, and lived. This work explores consciousness, mind, energy, symbolism, and the universal laws that quietly shape experience and reality.",
};

export default function EsoterimentPage() {
  const slugs = getArticleSlugs("esoteriment");
  const articles = slugs
    .map((slug) => getArticleBySlug("esoteriment", slug))
    .filter((article) => article !== null)
    .sort((a, b) => {
      if (!a || !b) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

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
          <div className="flex flex-wrap gap-3">
            {["Consciousness", "Mind", "Energy", "Symbolism", "Law"].map((category) => (
              <span
                key={category}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-[#7C8A9E] transition-colors cursor-pointer"
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
            <p className="text-lg">Articles coming soon...</p>
            <p className="mt-2 text-sm">Explore the foundations of esoteric wisdom.</p>
          </div>
        )}
      </div>
    </div>
  );
}

