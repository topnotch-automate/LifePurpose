import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <Container maxWidth="reading" className="text-center">
          <h1 className="text-h1 md:text-[3.5rem] font-serif font-semibold mb-6 text-balance">
            Live the Truth. Experience Life.
          </h1>
          <p className="text-body text-secondary mb-8 max-w-reading mx-auto">
            Timeless principles, lived daily.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/start-here" variant="primary">
              Begin Here
            </Button>
            <Button href="/sessions" variant="secondary">
              Book a Session
            </Button>
          </div>
        </Container>
      </section>

      {/* What Lifeward Is */}
      <section className="py-16 md:py-20 bg-background">
        <Container maxWidth="reading">
          <h2 className="text-h2 font-serif font-semibold mb-8 text-center">
            What Lifeward Is
          </h2>
          <div className="space-y-6 text-body text-foreground">
            <p>
              Lifeward is a coaching and teaching platform dedicated to helping
              individuals understand and live timeless spiritual principles —
              leading to clarity, discipline, and an abundant, excellent life.
            </p>
            <p>
              This work is grounded in practice over theory. We believe that
              understanding must be lived, not merely discussed. The principles
              we explore are not new — they are timeless. What changes is our
              capacity to embody them.
            </p>
            <p>
              Lifeward exists for those who are ready to move beyond insight and
              into integration. For those who sense that life is governed by
              deeper laws and who are willing to align themselves with those
              laws through consistent, faithful practice.
            </p>
          </div>
        </Container>
      </section>

      {/* Paths */}
      <section className="py-16 md:py-20">
        <Container>
          <h2 className="text-h2 font-serif font-semibold mb-12 text-center">
            Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <Link
              href="/coaching"
              className="p-6 border border-border rounded hover:border-accent transition-colors group"
            >
              <h3 className="text-h4 font-serif font-semibold mb-3 group-hover:text-accent transition-colors">
                Coaching
              </h3>
              <p className="text-small text-secondary">
                Guided practice in conscious living and practical alignment.
              </p>
            </Link>
            <Link
              href="/library"
              className="p-6 border border-border rounded hover:border-accent transition-colors group"
            >
              <h3 className="text-h4 font-serif font-semibold mb-3 group-hover:text-accent transition-colors">
                Teachings
              </h3>
              <p className="text-small text-secondary">
                Written teachings, articles, and foundational principles.
              </p>
            </Link>
            <Link
              href="/events"
              className="p-6 border border-border rounded hover:border-accent transition-colors group"
            >
              <h3 className="text-h4 font-serif font-semibold mb-3 group-hover:text-accent transition-colors">
                Events
              </h3>
              <p className="text-small text-secondary">
                Gatherings, workshops, and community connections.
              </p>
            </Link>
            <Link
              href="/library"
              className="p-6 border border-border rounded hover:border-accent transition-colors group"
            >
              <h3 className="text-h4 font-serif font-semibold mb-3 group-hover:text-accent transition-colors">
                Resources
              </h3>
              <p className="text-small text-secondary">
                Books, guides, and curated materials for practice.
              </p>
            </Link>
          </div>
        </Container>
      </section>

      {/* Quiet Authority Section */}
      <section className="py-16 md:py-20 bg-background">
        <Container maxWidth="reading">
          <blockquote className="text-h3 font-serif font-normal text-center text-foreground italic border-l-4 border-accent pl-8 py-4">
            Understanding reveals truth. Practice proves it.
          </blockquote>
        </Container>
      </section>
    </>
  );
}

