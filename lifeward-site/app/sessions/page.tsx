import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import BookingWidget from "@/components/booking/BookingWidget";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sessions | Lifeward",
  description:
    "A Lifeward session is a guided conversation, not a performance. It is a space for clarity, reflection, and alignment — approached calmly, honestly, and without pressure.",
};

export default function SessionsPage() {
  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container maxWidth="reading">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-body text-secondary italic mb-4">
            How the Work Unfolds
          </p>
          <h1 className="text-h1 md:text-[3rem] font-serif font-semibold mb-6">
            About Lifeward Sessions
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Opening */}
          <section>
            <p className="text-body mb-4">
              A Lifeward session is a <strong>guided conversation</strong>, not
              a performance.
            </p>
            <p className="text-body mb-4">
              It is a space for clarity, reflection, and alignment — approached
              calmly, honestly, and without pressure.
            </p>
            <p className="text-body">
              The goal is not emotional release alone, but{" "}
              <strong>understanding that leads to practice</strong>.
            </p>
          </section>

          {/* Before the Session */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Before the Session
            </h2>
            <p className="text-body mb-4">
              Before booking, you will be asked a few simple questions:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-body mb-4">
              <li>What are you currently seeking clarity on?</li>
              <li>What feels misaligned or unresolved?</li>
              <li>What do you hope to understand or live more clearly?</li>
            </ul>
            <p className="text-body">
              These are not assessments.
              <br />
              They simply help orient the session.
            </p>
          </section>

          {/* During the Session */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              During the Session
            </h2>
            <p className="text-body mb-4">
              Sessions are conversational and reflective.
            </p>
            <p className="text-body mb-4">We may:</p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-body mb-4">
              <li>Clarify identity and perspective</li>
              <li>Examine thought patterns and assumptions</li>
              <li>Identify points of inner conflict</li>
              <li>Restore simplicity and focus</li>
              <li>Translate insight into practical steps</li>
            </ul>
            <p className="text-body">
              There is no pressure to perform or impress.
              <br />
              Silence is welcome. Reflection is encouraged.
            </p>
          </section>

          {/* After the Session */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              After the Session
            </h2>
            <p className="text-body mb-4">
              Clarity does not end when the session ends.
            </p>
            <p className="text-body mb-4">You may leave with:</p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-body mb-4">
              <li>A reframed understanding</li>
              <li>A principle to reflect on</li>
              <li>A simple practice to apply</li>
              <li>Greater inner order and calm</li>
            </ul>
            <p className="text-body">
              Integration happens in daily life.
              <br />
              The session prepares the ground.
            </p>
          </section>

          {/* Session Types */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Session Types
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  30-Minute Session
                </h3>
                <p className="text-body text-secondary">
                  For focused clarity on a specific question or situation.
                </p>
              </div>
              <div>
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  60-Minute Session
                </h3>
                <p className="text-body text-secondary">
                  For deeper exploration, integration, and guidance.
                </p>
              </div>
              <div>
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  90-Minute Session
                </h3>
                <p className="text-body text-secondary">
                  For those seeking unhurried reflection and foundational work.
                </p>
              </div>
            </div>
            <p className="text-body mt-6">
              Each session is conducted online and scheduled at a mutually
              respectful time.
            </p>
          </section>

          {/* Frequency */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Frequency
            </h2>
            <p className="text-body mb-4">Some benefit from a single session.</p>
            <p className="text-body mb-4">Others from a steady rhythm.</p>
            <p className="text-body">
              There is no prescribed frequency — only what supports clarity and
              faithful practice.
            </p>
          </section>

          {/* Confidentiality & Presence */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Confidentiality & Presence
            </h2>
            <p className="text-body mb-4">
              All sessions are private and confidential.
            </p>
            <p className="text-body">
              This is a space of trust, attentiveness, and respect.
            </p>
          </section>

          {/* A Final Orientation */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-h2 font-serif font-semibold mb-6">
              A Final Orientation
            </h2>
            <p className="text-body mb-4">
              Sessions do not replace your life.
              <br />
              They support it.
            </p>
            <p className="text-body mb-6">
              They are not where transformation happens — they are where{" "}
              <strong>alignment begins</strong>.
            </p>
            <p className="text-body mb-6">
              If you feel drawn to this work, trust that impulse calmly.
            </p>
          </section>

          {/* Booking Widget */}
          <section className="pt-12 border-t border-border">
            <BookingWidget />
          </section>
        </div>
      </Container>
    </div>
  );
}

