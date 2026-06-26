import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/mdx";
import { generatePageMetadata } from "@/lib/metadata";
import { LiamFramework } from "@/components/lifeward/LiamFramework";
import { LearnArticleCard } from "@/components/lifeward/LearnArticleCard";
import { OnlineCourseSection } from "@/components/lifeward/OnlineCourseSection";
import { NewsletterSignup } from "@/components/lifeward/NewsletterSignup";
import { getWorkWithMeUrl } from "@/lib/site-links";

export const metadata: Metadata = generatePageMetadata({
  path: "/",
  title: { absolute: "Lifeward Coaching Inc." },
  description:
    "Lifeward Coaching helps you discover true identity and live from alignment through timeless spiritual truth and daily practice.",
});

export const dynamic = "force-dynamic";

export default function HomePage() {
  const latestArticles = getAllArticles().slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="text-center mb-14">
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-light text-[var(--navy)] mb-5 leading-tight">
            Know who you truly are. Live the life that follows.
          </h1>
          <p className="text-lg md:text-xl text-[var(--mid)] max-w-3xl mx-auto mb-8">
            I help young Ghanaians discover their true identity — beneath culture,
            failure, and expectation — so they can build lives of purpose,
            clarity, and success, grounded in timeless spiritual truth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={getWorkWithMeUrl()}
              className="inline-flex items-center justify-center px-7 py-3 rounded-lg font-medium bg-[var(--gold)] text-white hover:bg-[#B08424] transition-colors min-w-[12rem]"
            >
              Work With Me
            </Link>
            <Link
              href="/start-here"
              className="inline-flex items-center justify-center px-7 py-3 rounded-lg font-medium border-2 border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--sky)] transition-colors min-w-[12rem]"
            >
              Start Here
            </Link>
          </div>
        </div>

        {/* Philosophy Bridge */}
        <div className="max-w-[580px] mx-auto mb-14">
          <p className="text-[var(--charcoal)]/90 text-lg leading-relaxed">
            Most people live from a mistaken identity — shaped by failure,
            culture, and expectation. I help you understand your true nature
            and build a life that reflects it. This involves both deep
            understanding and daily practice. They are not separate — they are
            one journey.
          </p>
        </div>

        {/* Three Panel Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          <Link
            href="/about"
            className="rounded-2xl border border-[var(--light)] bg-white/60 p-7 hover:shadow-sm transition-shadow"
          >
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">
              Who I Help
            </div>
            <p className="text-[var(--charcoal)]">
              For identity confusion, faith-ambition tension, and feeling stuck
              — you are not alone.
            </p>
          </Link>

          <Link
            href={getWorkWithMeUrl()}
            className="rounded-2xl border border-[var(--light)] bg-white/60 p-7 hover:shadow-sm transition-shadow"
          >
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">
              How I Work
            </div>
            <p className="text-[var(--charcoal)]">
              Through the LIAM Framework — Lifeward, Identity, Alignment, and
              Method — we bring truth into daily life.
            </p>
          </Link>

          <Link
            href="/learn"
            className="rounded-2xl border border-[var(--light)] bg-white/60 p-7 hover:shadow-sm transition-shadow"
          >
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">
              Explore Writing
            </div>
            <p className="text-[var(--charcoal)]">
              Articles, mini-books, and teachings — Understanding and Practice
              in one library.
            </p>
          </Link>
        </div>
      </section>

      {/* LIAM Framework Block */}
      <LiamFramework />

      {/* Latest Writing Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--navy)]">
              LATEST WRITING
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-light text-[var(--navy)] mt-3">
              Recent reflections from the Lifeward library
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <LearnArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <OnlineCourseSection showLegacyAnchor />

      <section id="newsletter" className="bg-[var(--navy)] text-white py-14 md:py-16 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold-lt)] mb-2">
              STAY GROUNDED
            </div>
            <p className="text-white/80 max-w-xl">
              Weekly reflections on identity, discipline, and the daily practice
              of truth — delivered to your inbox.
            </p>
          </div>
          <NewsletterSignup theme="dark" source="newsletter:homepage" />
        </div>
      </section>
    </div>
  );
}
