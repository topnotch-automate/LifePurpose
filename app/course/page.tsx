import Link from "next/link";
import { CourseEmbed } from "@/components/course/CourseEmbed";

const courseTitle = process.env.NEXT_PUBLIC_COURSE_TITLE || "Online Course";
const courseDescription =
  process.env.NEXT_PUBLIC_COURSE_DESCRIPTION ||
  "Learn in a structured and practical way through this guided course.";
const courseEmbedUrl = process.env.NEXT_PUBLIC_COURSE_EMBED_URL || "";
const courseCtaUrl = process.env.NEXT_PUBLIC_COURSE_CTA_URL || "";
const courseCtaLabel = process.env.NEXT_PUBLIC_COURSE_CTA_LABEL || "Open Course";

export default function CoursePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-serif font-bold text-gray-900 md:text-5xl">{courseTitle}</h1>
          <p className="max-w-3xl text-lg text-gray-600">{courseDescription}</p>
        </div>

        {courseEmbedUrl ? (
          <CourseEmbed src={courseEmbedUrl} title={courseTitle} />
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <p className="font-medium">Course embed URL is not configured yet.</p>
            <p className="mt-2 text-sm">
              Set <code>NEXT_PUBLIC_COURSE_EMBED_URL</code> in your environment, then reload the page.
            </p>
          </div>
        )}

        {courseCtaUrl && (
          <div className="mt-6">
            <Link
              href={courseCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition-colors hover:bg-gray-800"
            >
              {courseCtaLabel}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
