import { OwwlishCourseEmbed } from "@/components/course/OwwlishCourseEmbed";
import { siteConfig } from "@/lib/site-config";

interface OnlineCourseSectionProps {
  /** Anchor id for in-page links (homepage uses `online-course`; legacy: `start-here-course`) */
  anchorId?: string;
  showLegacyAnchor?: boolean;
}

export function OnlineCourseSection({
  anchorId = siteConfig.course.homeAnchorId,
  showLegacyAnchor = false,
}: OnlineCourseSectionProps) {
  return (
    <section
      id={anchorId}
      aria-labelledby="online-course-heading"
      className="scroll-mt-24 py-14 md:py-16"
    >
      {showLegacyAnchor && (
        <span id="start-here-course" className="block scroll-mt-24 -mt-24" aria-hidden />
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--light)] bg-white/80 p-6 sm:p-8 shadow-sm">
          <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">
            Online Course
          </div>
          <h2
            id="online-course-heading"
            className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-light text-[var(--navy)] mb-3"
          >
            {siteConfig.course.title}
          </h2>
          <p className="text-[var(--charcoal)]/90 mb-6 max-w-2xl">
            {siteConfig.course.description}
          </p>
          <OwwlishCourseEmbed />
        </div>
      </div>
    </section>
  );
}
