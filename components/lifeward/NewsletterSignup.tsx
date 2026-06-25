"use client";

import { FormEvent, useId, useState } from "react";
import { cn } from "@/lib/utils";

type NewsletterTheme = "light" | "dark";

interface NewsletterSignupProps {
  className?: string;
  /** Analytics source tag + admin subscriber backup */
  source?: string;
  theme?: NewsletterTheme;
  layout?: "inline" | "stacked";
  submitLabel?: string;
  successMessage?: string;
  finePrint?: string;
}

/**
 * On-site newsletter signup — email only, subscribes via Kit (ConvertKit) API.
 * Requires KIT_API_KEY on the server (Vercel env).
 */
export function NewsletterSignup({
  className,
  source = "newsletter",
  theme = "light",
  layout = "inline",
  submitLabel = "Subscribe",
  successMessage,
  finePrint = "Unsubscribe anytime. We respect your privacy.",
}: NewsletterSignupProps) {
  const inputId = useId().replace(/:/g, "");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successText, setSuccessText] = useState(
    successMessage ?? "You're subscribed. Welcome to the newsletter."
  );

  const isDark = theme === "dark";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !trimmed.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/kit/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source,
          pageUrl: window.location.href,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        requiresConfirmation?: boolean;
      };

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          data.error || "Could not subscribe right now. Please try again."
        );
        return;
      }

      setSuccessText(
        successMessage ??
          (data.requiresConfirmation
            ? "Almost there — check your inbox and click the confirmation link to finish subscribing."
            : "You're subscribed. Welcome to the newsletter.")
      );
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-lg border px-4 py-3 text-sm font-medium",
          isDark
            ? "border-green-400/40 bg-green-950/40 text-green-100"
            : "border-green-200 bg-green-50 text-green-900",
          className
        )}
      >
        {successText}
      </div>
    );
  }

  const showError = status === "error" && errorMessage;

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <div
        className={cn(
          layout === "inline"
            ? "flex flex-col sm:flex-row gap-3 sm:items-center"
            : "space-y-3"
        )}
      >
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          className={cn(
            "w-full rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:ring-2 transition-colors",
            layout === "inline" && "sm:flex-1 sm:min-w-0",
            isDark
              ? "bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-[var(--gold-lt)] focus:border-[var(--gold-lt)]"
              : "bg-white border border-[var(--light)] text-[var(--charcoal)] placeholder:text-[var(--mid)] focus:ring-[var(--gold)]/40 focus:border-[var(--navy)]"
          )}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className={cn(
            "shrink-0 rounded-lg px-6 py-3 text-[15px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70",
            layout === "inline" && "sm:min-w-[9rem]",
            "bg-[var(--gold)] text-white hover:bg-[#B08424]"
          )}
        >
          {status === "submitting" ? "Subscribing…" : submitLabel}
        </button>
      </div>

      {showError ? (
        <p className={cn("text-xs", isDark ? "text-red-300" : "text-red-700")}>
          {errorMessage}
        </p>
      ) : finePrint ? (
        <p className={cn("text-xs", isDark ? "text-white/60" : "text-[var(--mid)]")}>
          {finePrint}
        </p>
      ) : null}
    </form>
  );
}
