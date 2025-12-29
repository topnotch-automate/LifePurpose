import Container from "@/components/ui/Container";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library | Lifeward",
  description:
    "Written teachings, articles, foundations, and reflections. A curated archive of timeless principles and practical guidance.",
};

export default function LibraryPage() {
  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container maxWidth="container">
        <div className="max-w-reading mx-auto mb-12">
          <h1 className="text-h1 md:text-[3rem] font-serif font-semibold mb-6">
            Library
          </h1>
          <p className="text-body text-secondary">
            A curated collection of teachings, articles, and resources. This
            is a teaching archive, not content noise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Foundations */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Foundations
            </h2>
            <div className="space-y-4">
              <Link
                href="/library/rich-premises"
                className="block p-4 border border-border rounded hover:border-accent transition-colors"
              >
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  The Rich Premises
                </h3>
                <p className="text-small text-secondary">
                  Core principles that ground all understanding.
                </p>
              </Link>
              <Link
                href="/library/esoteriment-foundation"
                className="block p-4 border border-border rounded hover:border-accent transition-colors"
              >
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  Esoteriment Foundation
                </h3>
                <p className="text-small text-secondary">
                  Understanding inner and outer experience.
                </p>
              </Link>
              <Link
                href="/library/lifeward-foundation"
                className="block p-4 border border-border rounded hover:border-accent transition-colors"
              >
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  Lifeward Foundation
                </h3>
                <p className="text-small text-secondary">
                  Principles guiding Lifeward work.
                </p>
              </Link>
            </div>
          </section>

          {/* Articles */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Articles
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded">
                <p className="text-body text-secondary italic">
                  Articles will be listed here as they are published.
                </p>
              </div>
            </div>
          </section>

          {/* Reflections */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Reflections
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded">
                <p className="text-body text-secondary italic">
                  Reflection pieces will appear here.
                </p>
              </div>
            </div>
          </section>

          {/* Practices */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Practices
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded">
                <p className="text-body text-secondary italic">
                  Practical guides and practices will be available here.
                </p>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}

