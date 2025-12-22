import Link from "next/link";
import { SectionPanel } from "@/components/ui/SectionPanel";
import { ArticleCard } from "@/components/article/ArticleCard";
import { VideoCarousel } from "@/components/video/VideoCarousel";
import { getAllArticles, getAllVideos } from "@/lib/mdx";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const latestArticles = getAllArticles().slice(0, 6);
  const featuredVideos = getAllVideos().slice(0, 4); // Show up to 4 videos in carousel
  
  // Get first article from each section for foundational CTAs
  const esoterimentArticles = getAllArticles("esoteriment");
  const lifewardArticles = getAllArticles("lifeward");
  const firstEsoterimentArticle = esoterimentArticles.length > 0 ? esoterimentArticles[0] : null;
  const firstLifewardArticle = lifewardArticles.length > 0 ? lifewardArticles[0] : null;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            I write to awaken clarity, discipline, and life.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-4 italic">
            Explore spiritual and practical wisdom for inner clarity and abundant life.
          </p>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Welcome to a digital sanctuary where understanding becomes practice.
            Explore timeless principles and their lived application through <strong>Esoteriment</strong> and <strong>Lifeward.</strong>
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

      {/* Start Here Section */}
      <section aria-labelledby="start-here" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div>
          <h2 id="start-here" className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
            Start Here
          </h2>
          
          <div className="space-y-4 text-lg text-gray-700 mb-8">
            <p>
              This platform is centered on one idea: truth must be understood and lived.
            </p>
            
            <p>
              If you are drawn to understanding the deeper laws of mind, consciousness,
              and reality, begin with <strong>Esoteriment</strong>.
            </p>
            
            <p>
              If you are drawn to applying truth faithfully in daily life—through
              discipline, character, and practice—begin with <strong>Lifeward</strong>.
            </p>
            
            <p className="text-gray-600">
              Many readers find value in walking both paths together.
            </p>
          </div>

          <nav className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/esoteriment"
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              Begin with Esoteriment
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/lifeward"
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              Begin with Lifeward
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </nav>
        </div>
      </section>

      {/* Two Feature Panels */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <SectionPanel
            title="Esoteriment"
            subtitle="Understand the unseen"
            tagline="Understand the unseen with clear metaphysical insights"
            description="Esoteriment exists to bring clarity to what is often hidden or misunderstood. Here I simplify esoteric, metaphysical, and mystical ideas so they can be understood, tested, and lived. This work explores consciousness, mind, energy, symbolism, and the universal laws that quietly shape experience and reality."
            href="/esoteriment"
            theme="esoteriment"
          />
          <SectionPanel
            title="Lifeward"
            subtitle="Live the truth"
            tagline="Apply timeless spiritual truths to everyday life"
            description="Lifeward is devoted to the daily practice of God's timeless principles. Here, faith is not abstract belief, but something lived and expressed through discipline, character, gratitude, prayer, health, and ordinary daily life. The aim is simple: to grow into a life that is more ordered, faithful, and abundant."
            href="/lifeward"
            theme="lifeward"
          />
        </div>
      </section>

      {/* Featured Videos */}
      {featuredVideos.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Featured Teachings
            </h2>
            <p className="text-lg text-gray-600">
              Curated video teachings to inspire and guide.
            </p>
          </div>
          <VideoCarousel videos={featuredVideos} />
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

      {/* Gentle CTAs for Deeper Exploration */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="border-t border-gray-200 pt-12">
          <div className="grid md:grid-cols-3 gap-6">
            {firstEsoterimentArticle && (
              <Link
                href={`/esoteriment/${firstEsoterimentArticle.slug}`}
                className="group p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                  Read a foundational Esoteriment article
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {firstEsoterimentArticle.title}
                </p>
                <span className="text-sm text-gray-500 inline-flex items-center gap-1 group-hover:text-gray-700">
                  Begin reading
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            )}
            {firstLifewardArticle && (
              <Link
                href={`/lifeward/${firstLifewardArticle.slug}`}
                className="group p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                  Start your Lifeward journey here
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {firstLifewardArticle.title}
                </p>
                <span className="text-sm text-gray-500 inline-flex items-center gap-1 group-hover:text-gray-700">
                  Begin reading
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            )}
            <Link
              href="/books"
              className="group p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                Browse the Mini-Books Library
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Explore practical guides and teachings in book format.
              </p>
              <span className="text-sm text-gray-500 inline-flex items-center gap-1 group-hover:text-gray-700">
                View books
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
