import Link from "next/link";
import { SmartCta } from "@/components/lifeward/ComingSoonControl";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Work With Me",
  description:
    "Six-week Lifeward Coaching programme to help you move from confusion to clear identity and purposeful daily practice.",
};

export default function WorkWithMePage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] py-12 md:py-16 lg:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-light text-[var(--navy)] leading-tight mb-4">
            In six weeks, you will go from feeling lost and reactive to living
            with clear identity and purposeful direction — grounded in who God
            made you to be.
          </h1>
        </header>

        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4 text-center lg:text-left">
              IS THIS FOR YOU?
            </div>
            <ul className="space-y-3 text-[var(--charcoal)] text-lg">
              <li>
                You feel stuck — capable and faithful, but not living the life
                you know is possible.
              </li>
              <li>
                You sense a gap between who you are spiritually and how your
                daily life actually feels.
              </li>
              <li>
                You are tired of consuming content without experiencing real
                transformation.
              </li>
              <li>
                You want to understand yourself at a deeper level — not just get
                motivated.
              </li>
              <li>
                You are ready to bring your faith, identity, and daily practice
                into alignment.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4 text-center lg:text-left">
              THE WORK
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-[var(--gold)] pl-4">
                <div className="font-[family-name:var(--font-label)] uppercase tracking-[0.18em] text-xs text-[var(--navy)] mb-1">
                  Identity Clarity
                </div>
                <p className="text-[var(--charcoal)]/90">
                  Discovering and understanding your true nature beneath the
                  noise of others&apos; expectations.
                </p>
              </div>
              <div className="border-l-4 border-[var(--gold)] pl-4">
                <div className="font-[family-name:var(--font-label)] uppercase tracking-[0.18em] text-xs text-[var(--navy)] mb-1">
                  Mind Renewal
                </div>
                <p className="text-[var(--charcoal)]/90">
                  Applying the principles of thought, belief, and feeling to
                  genuinely transform daily experience.
                </p>
              </div>
              <div className="border-l-4 border-[var(--gold)] pl-4">
                <div className="font-[family-name:var(--font-label)] uppercase tracking-[0.18em] text-xs text-[var(--navy)] mb-1">
                  Daily Practice
                </div>
                <p className="text-[var(--charcoal)]/90">
                  Building the habits, disciplines, and character expressions
                  that reflect your true identity consistently.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-6">
            WHAT THE JOURNEY LOOKS LIKE
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--light)] bg-white/60 p-6">
              <div className="text-[var(--gold)] font-[family-name:var(--font-label)] uppercase tracking-[0.25em] text-xs mb-3">
                Step 1 — Clarity
              </div>
              <p className="text-[var(--charcoal)]">
                We identify where you are and what is actually in the way.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--light)] bg-white/60 p-6">
              <div className="text-[var(--gold)] font-[family-name:var(--font-label)] uppercase tracking-[0.25em] text-xs mb-3">
                Step 2 — Alignment
              </div>
              <p className="text-[var(--charcoal)]">
                We work through your identity, beliefs, and inner patterns
                using the LIAM Framework.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--light)] bg-white/60 p-6">
              <div className="text-[var(--gold)] font-[family-name:var(--font-label)] uppercase tracking-[0.25em] text-xs mb-3">
                Step 3 — Practice
              </div>
              <p className="text-[var(--charcoal)]">
                You leave with a clear personal practice and an understanding
                you can build on for life.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--light)] bg-white/60 p-7">
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--navy)] mb-4">
              THE OFFER
            </div>
            <div className="space-y-3 text-[var(--charcoal)]">
              <p>
                <span className="font-medium">
                  Programme:
                </span>{" "}
                [Name Your Programme]
              </p>
              <p>
                <span className="font-medium">Duration:</span> 6 weeks
              </p>
              <p>
                <span className="font-medium">Format:</span> Weekly 1-on-1 sessions (60 minutes)
              </p>
              <p>
                <span className="font-medium">Investment:</span> [Add your price]
              </p>
              <p>
                <span className="font-medium">Booking:</span>{" "}
                Start with a free discovery call.
              </p>
            </div>
            <div className="mt-6">
              <SmartCta
                href={siteConfig.calendlyUrl}
                variant="primary"
                className="w-full"
                external
              >
                Book a Free Discovery Call
              </SmartCta>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--light)] bg-white/60 p-7">
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--navy)] mb-4">
              WHAT OTHERS SAY
            </div>
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[var(--light)] bg-white p-5"
                >
                  <p className="text-[var(--mid)]">
                    [Client testimonial coming soon]
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 text-center">
          <p className="text-sm text-[var(--mid)]">
            Prefer to explore first?{" "}
            <Link href="/learn" className="text-[var(--royal)] underline underline-offset-4">
              Read the writing
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

