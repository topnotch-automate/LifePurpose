import Container from "@/components/ui/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Lifeward",
  description:
    "A statement of service. Why we teach, how we understand truth, and what guides this work.",
};

export default function AboutPage() {
  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container maxWidth="reading">
        <h1 className="text-h1 md:text-[3rem] font-serif font-semibold mb-12">
          About
        </h1>

        <div className="space-y-12">
          {/* Opening */}
          <section>
            <p className="text-body mb-4">
              This is not a resume. This is a <strong>statement of service</strong>.
            </p>
          </section>

          {/* Why We Teach */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Why We Teach
            </h2>
            <p className="text-body mb-4">
              We teach because we have found that timeless principles, when
              understood and lived, lead to clarity, order, and an abundant life.
            </p>
            <p className="text-body mb-4">
              We teach because many people live with insight but without
              integration. They understand spiritual ideas, yet struggle to
              apply them consistently in daily life.
            </p>
            <p className="text-body">
              We teach to bridge the gap between knowing and living, between
              insight and embodiment.
            </p>
          </section>

          {/* How We Understand Truth */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              How We Understand Truth
            </h2>
            <p className="text-body mb-4">
              Truth is not a concept to be debated. It is a principle to be
              lived.
            </p>
            <p className="text-body mb-4">
              We understand truth as that which is consistent, lawful, and
              reliable. It is not relative to opinion, but absolute in its
              nature.
            </p>
            <p className="text-body">
              Our work is grounded in principles that have been recognized
              across traditions and time. We do not claim to have discovered
              them; we claim to be learning to live them.
            </p>
          </section>

          {/* What Guides This Work */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              What Guides This Work
            </h2>
            <p className="text-body mb-4">This work is guided by:</p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-body mb-4">
              <li>Respect for the individual journey</li>
              <li>Commitment to practical application</li>
              <li>Recognition of the relationship between inner and outer life</li>
              <li>Faith in the lawful nature of reality</li>
              <li>Patience with the process of integration</li>
            </ul>
            <p className="text-body">
              We do not promise quick fixes or instant transformation. We offer
              clarity, guidance, and support for those willing to practice.
            </p>
          </section>

          {/* Who This Is Not For */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Who This Is Not For
            </h2>
            <p className="text-body mb-4">
              This work may not be for those seeking:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-body mb-4">
              <li>Entertainment or distraction</li>
              <li>Debate or intellectual sparring</li>
              <li>Instant transformation without practice</li>
              <li>External validation or approval</li>
              <li>Quick fixes or affirmations</li>
            </ul>
            <p className="text-body">
              This work is for those who are ready to take responsibility for
              their inner world and align their lives with deeper principles.
            </p>
          </section>

          {/* Closing */}
          <section className="pt-8 border-t border-border">
            <p className="text-body italic text-secondary">
              If you feel drawn to this work, trust that impulse. If you do
              not, that is also fine. This is not for everyone, and that is by
              design.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}

