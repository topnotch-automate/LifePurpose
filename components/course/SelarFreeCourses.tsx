import { siteConfig } from "@/lib/site-config";

export function SelarFreeCourses() {
  const { pillars } = siteConfig.course;

  return (
    <div className="space-y-4">
      {pillars.map((pillar) => (
        <article
          key={pillar.url}
          className="rounded-xl border border-[var(--light)] bg-[var(--cream)]/50 p-5 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-2">
                {pillar.label} · Free on Selar
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-light text-[var(--navy)]">
                {pillar.title}
              </h3>
            </div>
            <a
              href={pillar.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center px-6 py-3 rounded-lg font-medium bg-[var(--gold)] text-white hover:bg-[#B08424] transition-colors"
            >
              Enroll free
            </a>
          </div>
        </article>
      ))}
      <p className="text-sm text-[var(--mid)] text-center pt-1">
        Opens on Selar in a new tab. Start with Pillar #1, then continue through #2 and #3.
      </p>
    </div>
  );
}
