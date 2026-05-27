import Link from "next/link";
import { KitLandingEmbedDark } from "@/components/lifeward/KitLandingEmbed";

export default function StartHerePage() {
  const readingPath = [
    {
      href: "/esoteriment/understanding-esoteriment",
      title: "Understanding Esoteriment",
      desc: "What this work is — and why it matters.",
    },
    {
      href: "/esoteriment/identity-the-foundation-of-all-seeking",
      title: "Identity: The Foundation of All Seeking",
      desc: "The first and most important question answered.",
    },
    {
      href: "/esoteriment/spirit-creation-and-consciousness",
      title: "Spirit, Creation, and Consciousness",
      desc: "How identity connects to reality.",
    },
    {
      href: "/lifeward/living-lifeward",
      title: "Living Lifeward",
      desc: "How understanding becomes daily practice.",
    },
    {
      href: "/esoteriment/thought-belief-and-feeling",
      title: "Thought, Belief, and Feeling",
      desc: "The mechanics of transformation.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--cream)] py-12 md:py-16 lg:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-light text-[var(--navy)] mb-4">
            Welcome. You are in the right place.
          </h1>
          <p className="text-lg text-[var(--charcoal)]/90 max-w-3xl mx-auto mb-4">
            This site holds both understanding and practice — and they are one
            journey. If you are tired of feeling lost, reactive, or disconnected,
            you are in the right place. Take the next step with the reading path
            below.
          </p>
          <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
            TRUTH MUST BE UNDERSTOOD AND LIVED.
          </div>
        </header>

        <section className="mb-12">
          <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--navy)] mb-5 text-center">
            WHERE TO BEGIN
          </div>
          <ol className="space-y-4">
            {readingPath.map((item, idx) => (
              <li
                key={item.href}
                className="rounded-2xl border border-[var(--light)] bg-white/60 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="text-[var(--gold)] font-[family-name:var(--font-label)] uppercase tracking-[0.25em] text-xs mt-1">
                    {idx + 1}
                  </div>
                  <div>
                    <Link
                      href={item.href}
                      className="font-medium text-[var(--navy)] hover:underline underline-offset-4"
                    >
                      {item.title}
                    </Link>
                    <p className="text-[var(--mid)] mt-1">{item.desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-14">
          <div className="bg-[var(--navy)] text-white rounded-2xl border border-white/10 p-7">
            <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold-lt)] mb-3">
              FREE CHAPTER + EMAIL LIST
            </div>
            <KitLandingEmbedDark
              title="Download the first chapter of How to Befriend Your Ego"
              description="Enter your email below to get the first chapter and join the Lifeward Coaching list — clarity on identity, the ego, and daily practice."
              height={720}
            />
          </div>
        </section>

        <section className="text-center">
          <Link
            href="/work-with-me"
            className="inline-flex items-center justify-center px-7 py-3 rounded-lg font-medium bg-[var(--gold)] text-white hover:bg-[#B08424] transition-colors"
          >
            Ready to go deeper? Work With Me.
          </Link>
        </section>
      </div>
    </div>
  );
}
