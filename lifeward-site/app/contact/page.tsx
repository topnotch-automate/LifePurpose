"use client";

import Container from "@/components/ui/Container";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", inquiryType: "general", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container maxWidth="reading">
        <h1 className="text-h1 md:text-[3rem] font-serif font-semibold mb-8">
          Contact
        </h1>

        <div className="space-y-12">
          {/* Introduction */}
          <section>
            <p className="text-body mb-4">
              For general inquiries, questions about coaching, or information
              about events, please use the form below.
            </p>
            <p className="text-body text-secondary">
              We will respond within 2-3 business days.
            </p>
          </section>

          {/* Contact Form */}
          <section>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="inquiryType"
                  className="block text-sm font-medium mb-2"
                >
                  Inquiry Type
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="coaching">Coaching Inquiry</option>
                  <option value="events">Events</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-vertical"
                />
              </div>

              {submitStatus === "success" && (
                <div className="p-4 bg-success/10 border border-success/20 rounded text-body text-success">
                  Thank you for your message. We will respond within 2-3 business days.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-error/10 border border-error/20 rounded text-body text-error">
                  {error || "There was an error sending your message. Please try again."}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                onClick={() => {}}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </section>

          {/* Alternative Contact */}
          <section className="pt-8 border-t border-border">
            <p className="text-body text-secondary">
              For urgent matters or to book a session directly, please visit the{" "}
              <a href="/sessions" className="text-accent hover:underline">
                Sessions page
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}

