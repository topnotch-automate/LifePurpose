import Container from "@/components/ui/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Lifeward",
  description: "Privacy policy for Lifeward coaching platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPage() {
  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container maxWidth="reading">
        <h1 className="text-h1 md:text-[3rem] font-serif font-semibold mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-body">
          <section>
            <p className="text-secondary">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Information We Collect
            </h2>
            <p className="mb-4">
              When you use Lifeward, we may collect the following information:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 mb-4">
              <li>
                <strong>Contact Information:</strong> Name, email address, and
                any information you provide through contact forms or booking
                intake forms.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with our website, including pages visited and time spent.
              </li>
              <li>
                <strong>Communication Data:</strong> Messages and inquiries you
                send to us.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-outside ml-6 space-y-2 mb-4">
              <li>Respond to your inquiries and provide coaching services</li>
              <li>Process and confirm session bookings</li>
              <li>Send you relevant information about sessions and events</li>
              <li>Improve our website and services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Data Protection
            </h2>
            <p className="mb-4">
              We take the protection of your personal information seriously. We
              implement appropriate technical and organizational measures to
              protect your data against unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Third-Party Services
            </h2>
            <p className="mb-4">
              We may use third-party services for:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 mb-4">
              <li>
                <strong>Email Services:</strong> We use Resend to send emails.
                Your email address is shared with Resend for this purpose.
              </li>
              <li>
                <strong>Booking Services:</strong> If you book a session through
                Cal.com or Calendly, your information is processed by those
                services according to their privacy policies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Your Rights
            </h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-outside ml-6 space-y-2 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
            </ul>
            <p>
              To exercise these rights, please contact us at{" "}
              <a href="/contact" className="text-accent hover:underline">
                our contact page
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-serif font-semibold mb-4">
              Contact Us
            </h2>
            <p>
              If you have questions about this privacy policy, please{" "}
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

