import Link from "next/link";

interface CourseReferenceProps {
  className?: string;
}

export function CourseReference({ className = "" }: CourseReferenceProps) {
  return (
    <section
      className={`mt-10 rounded-2xl border border-[var(--light)] bg-white/80 p-6 ${className}`.trim()}
      aria-label="Course reference"
    >
      <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-2">
        Online Course
      </div>
      <h2 className="text-lg font-medium text-[var(--navy)]">Continue with the course</h2>
      <p className="mt-2 text-[var(--charcoal)]/90">
        If this content helped, take the next step with the guided course — structured
        lessons for understanding and daily practice.
      </p>
      <Link
        href="/course"
        className="mt-4 inline-flex items-center text-sm font-medium text-[var(--royal)] hover:underline underline-offset-4"
      >
        Open the course →
      </Link>
    </section>
  );
}
