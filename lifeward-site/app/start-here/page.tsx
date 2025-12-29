import Container from "@/components/ui/Container";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Here | Lifeward",
  description:
    "A guided entry point to Lifeward. Learn how to use this platform and where to begin your journey.",
};

export default function StartHerePage() {
  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container maxWidth="reading">
        <h1 className="text-h1 md:text-[3rem] font-serif font-semibold mb-8">
          Start Here
        </h1>

        <div className="space-y-12">
          {/* How to Use This Platform */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              How to Use This Platform
            </h2>
            <p className="text-body mb-4">
              Lifeward is designed to support your journey from understanding to
              embodiment. This platform offers multiple entry points, each
              serving a distinct purpose.
            </p>
            <p className="text-body mb-4">
              Whether you are new to these principles or seeking deeper
              integration, this guide will help you navigate thoughtfully.
            </p>
            <p className="text-body">
              Take your time. There is no rush. Clarity comes through attention,
              not consumption.
            </p>
          </section>

          {/* Foundations */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Foundational Readings
            </h2>
            <p className="text-body mb-6">
              These foundational pieces provide the philosophical and practical
              groundwork for all that follows. Read them in order:
            </p>
            <div className="space-y-6">
              <div className="p-6 border border-border rounded">
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  The Rich Premises
                </h3>
                <p className="text-body text-secondary mb-4">
                  Core principles that ground all understanding and practice.
                </p>
                <Link
                  href="/library/rich-premises"
                  className="text-accent hover:underline text-body"
                >
                  Read →
                </Link>
              </div>
              <div className="p-6 border border-border rounded">
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  Esoteriment Foundation
                </h3>
                <p className="text-body text-secondary mb-4">
                  Understanding the relationship between inner and outer
                  experience.
                </p>
                <Link
                  href="/library/esoteriment-foundation"
                  className="text-accent hover:underline text-body"
                >
                  Read →
                </Link>
              </div>
              <div className="p-6 border border-border rounded">
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  Lifeward Foundation
                </h3>
                <p className="text-body text-secondary mb-4">
                  The principles and practices that guide Lifeward coaching and
                  teaching.
                </p>
                <Link
                  href="/library/lifeward-foundation"
                  className="text-accent hover:underline text-body"
                >
                  Read →
                </Link>
              </div>
            </div>
          </section>

          {/* Suggested Paths */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Suggested Paths
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-h4 font-serif font-semibold mb-3">
                  If you are new to these principles:
                </h3>
                <ol className="list-decimal list-outside ml-6 space-y-2 text-body">
                  <li>Read the foundational pieces above</li>
                  <li>Explore the Library for articles and teachings</li>
                  <li>Consider booking a clarity session</li>
                </ol>
              </div>
              <div>
                <h3 className="text-h4 font-serif font-semibold mb-3">
                  If you are ready for practice:
                </h3>
                <ol className="list-decimal list-outside ml-6 space-y-2 text-body">
                  <li>Review the Coaching page</li>
                  <li>Book a session to begin</li>
                  <li>Engage with ongoing practice</li>
                </ol>
              </div>
              <div>
                <h3 className="text-h4 font-serif font-semibold mb-3">
                  If you seek community:
                </h3>
                <ol className="list-decimal list-outside ml-6 space-y-2 text-body">
                  <li>Check upcoming Events</li>
                  <li>RSVP to gatherings</li>
                  <li>Engage with teachings and resources</li>
                </ol>
              </div>
            </div>
          </section>

          {/* A Note */}
          <section className="pt-8 border-t border-border">
            <p className="text-body italic text-secondary">
              This page filters casual browsers from serious participants. If
              you are here, you are likely ready to engage with depth and
              sincerity. Trust that impulse.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}

