import { getDailyPractice } from "@/lib/mdx";
import { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Daily Lifeward Practice",
  description: "Clarity for today. Faithfulness in living. Simple daily orientations drawn from timeless spiritual principles.",
};

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>;
}) {
  const params = await searchParams;
  const theme = params.theme;
  const practice = getDailyPractice(theme || undefined);

  if (!practice) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Daily Lifeward Practice
          </h1>
          <p className="text-body text-gray-700">
            No practices available at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-12 md:py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <Link
            href="/lifeward"
            className="text-sm font-medium text-[#9A7B4F] hover:text-[#8B7355] transition-colors inline-block mb-4"
          >
            ← Back to Lifeward
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
            Daily Lifeward Practice
          </h1>
          <p className="text-xl text-gray-600 italic">
            Clarity for today. Faithfulness in living.
          </p>
        </header>

        <div className="space-y-12">
          {/* Introduction */}
          <section className="prose prose-lg max-w-none">
            <p className="text-body text-gray-700 leading-relaxed">
              Lifeward practices are simple daily orientations drawn from timeless
              spiritual principles.
            </p>
            <p className="text-body text-gray-700 leading-relaxed">
              They are not tasks to complete, habits to track, or techniques to master.  
              They are gentle invitations to live from clarity rather than effort, from
              alignment rather than force.
            </p>
            <p className="text-body text-gray-700 leading-relaxed">
              Each practice is offered for reflection and application within ordinary life.
            </p>
          </section>

          {/* Today's Practice */}
          <section className="border-t border-gray-200 pt-12">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#9A7B4F] uppercase tracking-wide">
                  Theme: {practice.theme}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Orientation
                  </h2>
                  <p className="text-body text-gray-900 italic leading-relaxed">
                    {practice.orientation}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                    The Practice
                  </h2>
                  <div className="text-body text-gray-900 leading-relaxed">
                    <p className="whitespace-pre-line">{practice.practice}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Living Integration
                  </h2>
                  <p className="text-body text-gray-700 leading-relaxed">
                    {practice.livingIntegration}
                  </p>
                </div>

                <div className="border-l-4 border-[#9A7B4F] pl-6 py-4 bg-gray-50/50 rounded-r">
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Quiet Reminder
                  </h2>
                  <p className="text-body text-gray-900 italic leading-relaxed">
                    {practice.quietReminder}
                  </p>
                </div>
              </div>

              <footer className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  This practice is drawn from{" "}
                  <span className="italic">{practice.source}</span>.
                </p>
              </footer>
            </div>
          </section>

          {/* How to Use */}
          <section className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              How to Use This Page
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-body text-gray-700 leading-relaxed">
                You may return here daily for a practice, or revisit a practice that
                speaks to your current season.
              </p>
              <p className="text-body text-gray-700 leading-relaxed">
                There is no requirement to perform, measure, or improve.  
                Only to notice, reflect, and live attentively.
              </p>
            </div>
          </section>

          {/* Closing Invitation */}
          <section className="border-t border-gray-200 pt-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-body text-gray-700 leading-relaxed">
                If you desire guidance in living these principles more deeply,{" "}
                <Link
                  href="/contact"
                  className="text-[#9A7B4F] hover:text-[#8B7355] underline transition-colors"
                >
                  coaching is available
                </Link>
                .
              </p>
              <p className="text-body text-gray-700 leading-relaxed">
                Lifeward coaching exists to support clarity, discipline, and faithful
                living — not to impose direction, but to refine awareness and application.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

