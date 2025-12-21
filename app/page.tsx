import Link from "next/link";
import { SectionPanel } from "@/components/ui/SectionPanel";
import { ArticleCard } from "@/components/article/ArticleCard";
import { VideoCard } from "@/components/video/VideoCard";
import { getAllArticles, getAllVideos } from "@/lib/mdx";

export default function HomePage() {
  const latestArticles = getAllArticles().slice(0, 6);
  const featuredVideos = getAllVideos().slice(0, 1);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            I write to awaken clarity, discipline, and life.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Welcome to a digital sanctuary where wisdom meets practice. 
            Explore timeless principles and their practical application through 
            <strong> Esoteriment</strong> and <strong>Lifeward</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/esoteriment"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Read
            </Link>
            <Link
              href="/videos"
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Watch
            </Link>
            <Link
              href="/books"
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Practice
            </Link>
          </div>
        </div>
      </section>

      {/* Two Feature Panels */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <SectionPanel
            title="Esoteriment"
            subtitle="Understand the unseen"
            description="Simplifying esoteric, metaphysical, and mystical concepts. Exploring consciousness, mind, energy, symbolism, and the universal laws that govern reality."
            href="/esoteriment"
            theme="esoteriment"
          />
          <SectionPanel
            title="Lifeward"
            subtitle="Live the truth"
            description="Practical application of God's timeless principles for an abundant life. Faith in action, discipline, character, gratitude, and daily living."
            href="/lifeward"
            theme="lifeward"
          />
        </div>
      </section>

      {/* Featured Video */}
      {featuredVideos.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Featured Teaching
            </h2>
            <p className="text-lg text-gray-600">
              A curated video teaching to inspire and guide.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <VideoCard video={featuredVideos[0]} />
          </div>
        </section>
      )}

      {/* Latest Writings */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Latest Writings
          </h2>
          <p className="text-lg text-gray-600">
            Recent thoughts from both Esoteriment and Lifeward.
          </p>
        </div>
        
        {latestArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Articles coming soon...</p>
          </div>
        )}
      </section>
    </div>
  );
}
