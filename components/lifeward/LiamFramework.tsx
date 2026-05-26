const pillars = [
  {
    letter: "L",
    title: "Lifeward",
    description: "A life oriented toward truth, abundance, and God.",
  },
  {
    letter: "I",
    title: "Identity",
    description: "Knowing who you truly are beneath culture and expectation.",
  },
  {
    letter: "A",
    title: "Alignment",
    description: "Bringing thought, belief, and feeling into agreement with truth.",
  },
  {
    letter: "M",
    title: "Method",
    description: "Daily discipline, character, and consistent embodied practice.",
  },
];

export function LiamFramework() {
  return (
    <section className="bg-[var(--navy)] py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-label)] text-center text-sm md:text-base uppercase tracking-[0.3em] text-white mb-12">
          THE LIAM FRAMEWORK
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.letter}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <span className="font-[family-name:var(--font-label)] text-3xl text-[var(--gold-lt)] block mb-3">
                {pillar.letter}
              </span>
              <h3 className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.2em] text-white mb-3">
                {pillar.title}
              </h3>
              <p className="text-sm text-[var(--cream)]/90 leading-relaxed font-light">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
