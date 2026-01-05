import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coaching | Lifeward",
  description:
    "Lifeward coaching is a guided practice in conscious living. It helps you clarify identity, understand how inner life shapes outer experience, and align thought, belief, and action.",
};

export default function CoachingPage() {
  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container maxWidth="reading">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-body text-secondary italic mb-4">
            Live the Truth. Experience Life.
          </p>
          <h1 className="text-h1 md:text-[3rem] font-serif font-semibold mb-6">
            Coaching at Lifeward
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Opening */}
          <section>
            <p className="text-body mb-4">
              Lifeward coaching is not about fixing you.
            </p>
            <p className="text-body mb-4 font-semibold">
              It is about <strong>clarifying you</strong>.
            </p>
            <p className="text-body mb-4">
              Many people live with insight but without integration. They
              understand spiritual ideas, yet struggle to apply them
              consistently in daily life. Lifeward coaching exists to bridge
              this gap — between knowing and living, between insight and
              embodiment.
            </p>
            <p className="text-body">
              This work is grounded in timeless principles and focused on{" "}
              <strong>practical alignment</strong>: how you think, choose, act,
              and live.
            </p>
          </section>

          {/* What This Coaching Is */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              What This Coaching Is
            </h2>
            <p className="text-body mb-4">
              Lifeward coaching is a <strong>guided practice in conscious living</strong>.
            </p>
            <p className="text-body mb-4">It helps you:</p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-body mb-4">
              <li>Clarify identity and direction</li>
              <li>Understand how inner life shapes outer experience</li>
              <li>Develop discipline without harshness</li>
              <li>Align thought, belief, and action</li>
              <li>Live with greater order, faith, and confidence</li>
            </ul>
            <p className="text-body">
              This is not motivational coaching.
              <br />
              It is <strong>formative coaching</strong>.
            </p>
          </section>

          {/* What This Coaching Is Not */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              What This Coaching Is Not
            </h2>
            <p className="text-body mb-4">This is not:</p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-body mb-4">
              <li>Therapy</li>
              <li>Crisis counseling</li>
              <li>Religious instruction</li>
              <li>Quick fixes or affirmations</li>
            </ul>
            <p className="text-body">
              It is not about chasing outcomes.
              <br />
              It is about <strong>establishing alignment</strong> — and allowing
              outcomes to follow lawfully.
            </p>
          </section>

          {/* Who This Is For */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Who This Is For
            </h2>
            <p className="text-body mb-4">
              This coaching is for those who:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-body mb-4">
              <li>Sense that life is governed by deeper principles</li>
              <li>Desire clarity, not noise</li>
              <li>Are willing to practice, not just learn</li>
              <li>Want spiritual understanding that works in real life</li>
              <li>Are ready to take responsibility for their inner world</li>
            </ul>
            <p className="text-body">
              It may not be for those seeking entertainment, debate, or instant
              transformation.
            </p>
          </section>

          {/* Core Areas of Guidance */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Core Areas of Guidance
            </h2>
            <p className="text-body mb-4">
              Coaching sessions may explore:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-body mb-4">
              <li>Identity and self-understanding</li>
              <li>Faith as inner agreement</li>
              <li>Discipline and daily practice</li>
              <li>Thought, belief, and emotional alignment</li>
              <li>Direction, purpose, and life order</li>
              <li>
                Integrating spiritual truth into work, health, and relationships
              </li>
            </ul>
            <p className="text-body">
              Each session is shaped by <strong>where you are</strong>, not a
              rigid script.
            </p>
          </section>

          {/* Coaching Formats */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              Coaching Formats
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  1:1 Clarity Sessions
                </h3>
                <p className="text-body text-secondary">
                  Single sessions focused on insight, direction, and
                  understanding.
                </p>
              </div>
              <div>
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  Ongoing Guided Practice
                </h3>
                <p className="text-body text-secondary">
                  A steady rhythm of sessions designed to support integration,
                  discipline, and embodiment over time.
                </p>
              </div>
              <div>
                <h3 className="text-h4 font-serif font-semibold mb-2">
                  Identity & Alignment Work
                </h3>
                <p className="text-body text-secondary">
                  For those seeking deeper grounding in self-understanding and
                  conscious living.
                </p>
              </div>
            </div>
            <p className="text-body mt-6">
              Details and scheduling are available on the{" "}
              <a href="/sessions" className="text-accent hover:underline">
                Sessions page
              </a>
              .
            </p>
          </section>

          {/* A Note on Commitment */}
          <section>
            <h2 className="text-h2 font-serif font-semibold mb-6">
              A Note on Commitment
            </h2>
            <p className="text-body mb-4">This work rewards sincerity.</p>
            <p className="text-body mb-4">
              Clarity deepens with attention.
              <br />
              Practice matures with consistency.
            </p>
            <p className="text-body">
              Lifeward coaching honors your pace, but it does not bypass
              responsibility.
            </p>
          </section>

          {/* Invitation */}
          <section className="pt-8 border-t border-border">
            <p className="text-body mb-6">
              If you are ready to live more deliberately — with clarity,
              discipline, and faith — you are welcome here.
            </p>
            <Button href="/sessions" variant="primary">
              Book a Session
            </Button>
          </section>
        </div>
      </Container>
    </div>
  );
}

