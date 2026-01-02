"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

interface BookingWidgetProps {
  sessionType?: "30" | "60" | "90";
}

export default function BookingWidget({ sessionType }: BookingWidgetProps) {
  const [showIntake, setShowIntake] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const [intakeData, setIntakeData] = useState({
    name: "",
    email: "",
    sessionType: sessionType || "60",
    seekingClarity: "",
    currentChallenges: "",
    expectations: "",
  });

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/booking/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intakeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit booking request");
      }

      setSubmitStatus("success");
      // Reset form
      setIntakeData({
        name: "",
        email: "",
        sessionType: sessionType || "60",
        seekingClarity: "",
        currentChallenges: "",
        expectations: "",
      });
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
    setIntakeData({
      ...intakeData,
      [e.target.name]: e.target.value,
    });
  };

  // Check for booking service configuration (client-side safe)
  const calcomUsername = process.env.NEXT_PUBLIC_CALCOM_USERNAME;
  const calendlyUsername = process.env.NEXT_PUBLIC_CALENDLY_USERNAME;

  // If Cal.com or Calendly is configured, show embedded widget
  if (calcomUsername) {
    return (
      <Container maxWidth="container" className="my-12">
        <div className="max-w-4xl mx-auto">
          <iframe
            src={`https://cal.com/${calcomUsername}`}
            style={{
              width: "100%",
              height: "1000px",
              border: "none",
              borderRadius: "8px",
            }}
            title="Book a session"
          />
        </div>
      </Container>
    );
  }

  if (calendlyUsername) {
    return (
      <Container maxWidth="container" className="my-12">
        <div className="max-w-4xl mx-auto">
          <iframe
            src={`https://calendly.com/${calendlyUsername}`}
            style={{
              width: "100%",
              height: "1000px",
              border: "none",
              borderRadius: "8px",
            }}
            title="Book a session"
          />
        </div>
      </Container>
    );
  }

  // Fallback: Show intake form
  if (submitStatus === "success") {
    return (
      <Container maxWidth="reading" className="my-12">
        <div className="text-center space-y-6">
          <div className="p-6 bg-success/10 border border-success/20 rounded">
            <h3 className="text-h3 font-serif font-semibold mb-4 text-success">
              Booking Request Received
            </h3>
            <p className="text-body">
              Thank you for your booking request. We have received your intake
              information and will confirm the session details shortly.
            </p>
            <p className="text-body text-secondary mt-4">
              You will receive a confirmation email with next steps.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setShowIntake(false);
              setSubmitStatus("idle");
            }}
          >
            Book Another Session
          </Button>
        </div>
      </Container>
    );
  }

  if (!showIntake) {
    return (
      <Container maxWidth="reading" className="my-12">
        <div className="text-center space-y-6">
          <h2 className="text-h2 font-serif font-semibold">
            Book a Session
          </h2>
          <p className="text-body text-secondary">
            Before we schedule your session, we'd like to understand what you're
            seeking clarity on.
          </p>
          <Button variant="primary" onClick={() => setShowIntake(true)}>
            Begin Booking Process
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="reading" className="my-12">
      <form onSubmit={handleIntakeSubmit} className="space-y-6">
        <div>
          <h3 className="text-h3 font-serif font-semibold mb-6">
            Session Intake
          </h3>
          <p className="text-body text-secondary mb-6">
            These questions help us prepare for our time together. There are no
            right or wrong answers.
          </p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={intakeData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={intakeData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="sessionType" className="block text-sm font-medium mb-2">
            Session Duration *
          </label>
          <select
            id="sessionType"
            name="sessionType"
            required
            value={intakeData.sessionType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="30">30 Minutes - Focused Clarity</option>
            <option value="60">60 Minutes - Deeper Exploration</option>
            <option value="90">90 Minutes - Unhurried Reflection</option>
          </select>
        </div>

        <div>
          <label htmlFor="seekingClarity" className="block text-sm font-medium mb-2">
            What are you currently seeking clarity on? *
          </label>
          <textarea
            id="seekingClarity"
            name="seekingClarity"
            required
            rows={4}
            value={intakeData.seekingClarity}
            onChange={handleChange}
            placeholder="Share what you'd like to explore or understand more clearly..."
            className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-vertical"
          />
        </div>

        <div>
          <label htmlFor="currentChallenges" className="block text-sm font-medium mb-2">
            Current challenges or areas of misalignment (optional)
          </label>
          <textarea
            id="currentChallenges"
            name="currentChallenges"
            rows={3}
            value={intakeData.currentChallenges}
            onChange={handleChange}
            placeholder="If helpful, share what feels misaligned or unresolved..."
            className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-vertical"
          />
        </div>

        <div>
          <label htmlFor="expectations" className="block text-sm font-medium mb-2">
            What do you hope to understand or live more clearly? (optional)
          </label>
          <textarea
            id="expectations"
            name="expectations"
            rows={3}
            value={intakeData.expectations}
            onChange={handleChange}
            placeholder="Share your hopes or intentions for this work..."
            className="w-full px-4 py-3 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-vertical"
          />
        </div>

        {error && (
          <div className="p-4 bg-error/10 border border-error/20 rounded text-body text-error">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            onClick={() => {}}
          >
            {isSubmitting ? "Submitting..." : "Submit Booking Request"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowIntake(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Container>
  );
}

