import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ui/ContactForm";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  path: "/about",
  title: "About",
  description:
    "Learn the Lifeward Coaching approach and the LIAM framework behind identity, alignment, and daily practice.",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] py-12 md:py-16 lg:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-8">
          <header className="mb-4">
            <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-light text-[var(--navy)] mb-4">
              About
            </h1>
          </header>

          <div className="text-lg md:text-xl text-[var(--charcoal)]/90 leading-relaxed">
            <p className="mb-5">
              You know there is more to you than what your current life reflects.
              But somewhere between the expectations of others, the weight of
              past failures, and the noise of a fast world, you lost the thread
              back to yourself.
            </p>
            <p className="mb-5">
              I have walked that road. And what I found changed the way I
              live, work, and understand God.
            </p>
            <p className="mb-5">
              My own life is a clear example of moving from confusion toward
              clarity. For a long season I did what everyone else was doing —
              without much reason — going where people went, wanting the kind of
              life I saw others living, and often hitting a dead end.
            </p>
            <p className="mb-5">
              I experience life as an introvert, so I rarely asked others for
              help. When I faced a challenge, something in my gut said I was
              meant for more — but I could not name what that was. The question
              that changed everything was simple:{" "}
              <em className="text-[var(--navy)]">How do men become great?</em>
            </p>
            <p className="mb-5">
              Answers came as inspiration — and again and again, as books that
              showed up at the right time. Through one of them I understood that
              identity is the real battlefield, and that what separates people is
              not the unfairness of life but the knowledge of God and of
              yourself.
            </p>
            <p className="mb-5">
              What I share now is that integration: knowing God and knowing self,
              so you can move beyond victimhood and keep advancing toward who you
              were made to be — with clarity about where you come from, who you
              are, and where you are going.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--light)] bg-white/60 p-7">
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">
              The Lifeward Approach
            </div>
            <p className="text-[var(--charcoal)]/90 leading-relaxed mb-4">
              We don’t treat understanding as a destination. We treat it as the
              foundation for alignment — and alignment becomes daily practice.
            </p>
            <div className="space-y-2 text-[var(--charcoal)]">
              <p>
                <span className="font-medium text-[var(--navy)]">L — Lifeward:</span>{" "}
                a life oriented toward truth, abundance, and God.
              </p>
              <p>
                <span className="font-medium text-[var(--navy)]">I — Identity:</span>{" "}
                knowing who you truly are beneath culture and expectation.
              </p>
              <p>
                <span className="font-medium text-[var(--navy)]">A — Alignment:</span>{" "}
                bringing thought, belief, and feeling into agreement with truth.
              </p>
              <p>
                <span className="font-medium text-[var(--navy)]">M — Method:</span>{" "}
                daily discipline, character, and consistent embodied practice.
              </p>
            </div>
          </div>

          <div
            id="contact"
            className="scroll-mt-24 rounded-2xl border border-[var(--light)] bg-white/60 p-7"
          >
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--navy)] mb-3">
              Contact
            </div>
            <p className="text-[var(--mid)] mb-6">
              If you have questions or want to share feedback, use the contact
              form below.
            </p>
            <ContactForm />
          </div>

          {/* Dual CTA (bottom of page) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/work-with-me"
              className="inline-flex items-center justify-center px-7 py-3 rounded-lg font-medium bg-[var(--gold)] text-white hover:bg-[#B08424] transition-colors"
            >
              Work With Me
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center justify-center px-7 py-3 rounded-lg font-medium border-2 border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--sky)] transition-colors"
            >
              Read My Writing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

