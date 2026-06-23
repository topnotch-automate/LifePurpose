import { CourseEmbed } from "@/components/course/CourseEmbed";
import { OwwlishCourseEmbed } from "@/components/course/OwwlishCourseEmbed";
import { SelarFreeCourses } from "@/components/course/SelarFreeCourses";
import { isPlaceholderUrl, siteConfig } from "@/lib/site-config";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-2">
      {children}
    </div>
  );
}

export function CourseOfferings() {
  const { course } = siteConfig;
  const useIframeEmbed = !isPlaceholderUrl(course.embedUrl);

  return (
    <div className="space-y-10">
      <section aria-labelledby="selar-courses-heading">
        <SectionLabel>Free on Selar</SectionLabel>
        <h3
          id="selar-courses-heading"
          className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-light text-[var(--navy)] mb-2"
        >
          Two-pillar free course
        </h3>
        <p className="text-[var(--mid)] mb-5 max-w-2xl">
          Enroll at no cost on Selar — start with Pillar #1, then continue to Pillar #2.
        </p>
        <SelarFreeCourses />
      </section>

      <div className="border-t border-[var(--light)] pt-10">
        <section aria-labelledby="site-course-heading">
          <SectionLabel>On this site</SectionLabel>
          <h3
            id="site-course-heading"
            className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-light text-[var(--navy)] mb-2"
          >
            Guided course player
          </h3>
          <p className="text-[var(--mid)] mb-5 max-w-2xl">
            Start the structured lessons directly here — no need to leave the site.
          </p>
          {useIframeEmbed ? (
            <CourseEmbed src={course.embedUrl} title={course.title} />
          ) : (
            <OwwlishCourseEmbed />
          )}
        </section>
      </div>
    </div>
  );
}
