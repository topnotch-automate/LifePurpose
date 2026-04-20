import Link from "next/link";

interface CourseReferenceProps {
  className?: string;
}

export function CourseReference({ className = "" }: CourseReferenceProps) {
  return (
    <section
      className={`mt-10 rounded-lg border border-[#EADCC6] bg-[#FFF9F1] p-6 ${className}`.trim()}
      aria-label="Course reference"
    >
      <h2 className="text-lg font-semibold text-gray-900">Course</h2>
      <p className="mt-2 text-gray-700">
        If this content helped, continue through the guided Course path in Start Here.
      </p>
      <Link
        href="/#start-here"
        className="mt-4 inline-flex items-center text-sm font-medium text-[#8B7355] hover:underline"
      >
        Go to Course →
      </Link>
    </section>
  );
}
