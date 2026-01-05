import Container from "@/components/ui/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Lifeward",
  description:
    "Upcoming events, gatherings, and workshops. Join us for online and in-person events designed to support clarity, practice, and community.",
};

export default function EventsPage() {
  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container maxWidth="container">
        <div className="max-w-reading mx-auto">
          <h1 className="text-h1 md:text-[3rem] font-serif font-semibold mb-8">
            Events & Gatherings
          </h1>

          <div className="space-y-12">
            {/* Introduction */}
            <section>
              <p className="text-body mb-4">
                Lifeward events are spaces for practice, reflection, and
                connection. They are designed to support your journey from
                understanding to embodiment.
              </p>
              <p className="text-body">
                Whether online or in-person, these gatherings honor depth,
                presence, and sincere engagement.
              </p>
            </section>

            {/* Upcoming Events */}
            <section>
              <h2 className="text-h2 font-serif font-semibold mb-8">
                Upcoming Events
              </h2>
              <div className="space-y-8">
                {/* Placeholder for events - will be dynamic later */}
                <div className="p-6 border border-border rounded">
                  <p className="text-body text-secondary italic">
                    Events will be listed here. Check back soon or{" "}
                    <a href="/contact" className="text-accent hover:underline">
                      contact us
                    </a>{" "}
                    to be notified of upcoming gatherings.
                  </p>
                </div>
              </div>
            </section>

            {/* Event Types */}
            <section>
              <h2 className="text-h2 font-serif font-semibold mb-6">
                Types of Events
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-h4 font-serif font-semibold mb-2">
                    Online Gatherings
                  </h3>
                  <p className="text-body text-secondary">
                    Virtual sessions for reflection, teaching, and practice.
                    Accessible from anywhere.
                  </p>
                </div>
                <div>
                  <h3 className="text-h4 font-serif font-semibold mb-2">
                    In-Person Events
                  </h3>
                  <p className="text-body text-secondary">
                    Local gatherings for deeper connection and embodied practice.
                  </p>
                </div>
                <div>
                  <h3 className="text-h4 font-serif font-semibold mb-2">
                    Workshops
                  </h3>
                  <p className="text-body text-secondary">
                    Focused sessions on specific themes, practices, or
                    principles.
                  </p>
                </div>
              </div>
            </section>

            {/* RSVP Note */}
            <section className="pt-8 border-t border-border">
              <p className="text-body text-secondary">
                To be notified of upcoming events, please{" "}
                <a href="/contact" className="text-accent hover:underline">
                  reach out
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}

