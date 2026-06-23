import type { Metadata } from "next";
import Link from "next/link";
import { CourseOfferings } from "@/components/course/CourseOfferings";
import { generatePageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = generatePageMetadata({
  path: "/course",
  title: "Online Course",
  description: siteConfig.course.description,
});

export default function CoursePage() {
  const { course } = siteConfig;

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <header className="text-center mb-10 max-w-3xl mx-auto">
          <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">
            Online Course
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-light text-[var(--navy)] mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-[var(--mid)]">{course.description}</p>
        </header>

        <div className="rounded-2xl border border-[var(--light)] bg-white/80 p-6 sm:p-8 shadow-sm">
          <CourseOfferings />
        </div>

        <p className="text-center text-sm text-[var(--mid)] mt-8">
          New here?{" "}
          <Link href="/start-here" className="text-[var(--royal)] underline underline-offset-4">
            Start with the reading path
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
