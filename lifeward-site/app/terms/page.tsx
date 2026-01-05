import Container from "@/components/ui/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Lifeward",
  description: "Terms of service for Lifeward coaching platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TermsPage() {
  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container maxWidth="reading">
        <h1 className="text-h1 md:text-[3rem] font-serif font-semibold mb-8">
          Terms of Service
        </h1>

        <div className="space-y-8 text-body">
          <section>
            <p className="text-secondary">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Acceptance of Terms
            </h2>
            <p>
              By accessing and using Lifeward, you accept and agree to be bound
              by these Terms of Service. If you do not agree to these terms,
              please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Services
            </h2>
            <p className="mb-4">
              Lifeward provides coaching and teaching services focused on
              spiritual principles and practical alignment. Our services include:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 mb-4">
              <li>One-on-one coaching sessions</li>
              <li>Group events and gatherings</li>
              <li>Written teachings and resources</li>
              <li>Online content and materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Coaching Services
            </h2>
            <p className="mb-4">
              Lifeward coaching is not therapy, crisis counseling, or medical
              treatment. It is a guided practice in conscious living and
              spiritual alignment.
            </p>
            <p className="mb-4">
              By booking a session, you acknowledge that:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 mb-4">
              <li>
                Coaching is not a substitute for professional medical or
                psychological treatment
              </li>
              <li>
                You are responsible for your own decisions and actions
              </li>
              <li>
                Results may vary and are not guaranteed
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Session Cancellation
            </h2>
            <p>
              Please provide at least 24 hours notice for session cancellations.
              Cancellation policies may vary based on the booking service used.
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Intellectual Property
            </h2>
            <p className="mb-4">
              All content on Lifeward, including text, teachings, and materials,
              is protected by copyright and intellectual property laws. You may
              not reproduce, distribute, or create derivative works without
              written permission.
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Limitation of Liability
            </h2>
            <p>
              Lifeward and its services are provided "as is" without warranties
              of any kind. We are not liable for any indirect, incidental, or
              consequential damages arising from your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting. Your continued use of
              our services constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Contact
            </h2>
            <p>
              If you have questions about these terms, please{" "}
              <a href="/contact" className="text-accent hover:underline">
                contact us
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}

