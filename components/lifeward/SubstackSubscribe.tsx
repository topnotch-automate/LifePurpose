"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getSubstackEmbedUrl,
  getSubstackSubscribePageUrl,
} from "@/lib/substack";

type SubstackSubscribeVariant = "form" | "embed";
type SubstackSubscribeTheme = "light" | "dark";

interface SubstackSubscribeProps {
  /**
   * `embed` = official Substack iframe (most reliable on production).
   * `form` = custom UI posting via /api/substack/subscribe (may be blocked by Substack from Vercel).
   */
  variant?: SubstackSubscribeVariant;
  theme?: SubstackSubscribeTheme;
  className?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
  source?: string;
  finePrint?: string;
}

/**
 * Substack newsletter signup.
 * Prefer variant="embed" on the homepage — Substack often blocks server/datacenter POSTs.
 */
export function SubstackSubscribe({
  variant = "embed",
  theme = "light",
  className,
  title,
  description,
  submitLabel = "Subscribe",
  successMessage = "Thank you. Check your inbox to confirm your subscription on Substack.",
  source = "website",
  finePrint = "By subscribing, you agree to Substack's terms. You can unsubscribe anytime.",
}: SubstackSubscribeProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
      const res = await fetch("/api/substack/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source,
          pageUrl: window.location.href,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          data.error ||
            "Could not subscribe right now. Use the Substack link below or try the embedded form."
        );
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again or subscribe on Substack directly.");
    }
  }

  function openSubscribePage() {
    window.open(getSubstackSubscribePageUrl(email.trim() || undefined), "_blank", "noopener,noreferrer");
  }

  if (variant === "embed") {
    return (
      <div className={cn("w-full", className)}>
        {title ? (
          <h2
            className={cn(
              "font-[family-name:var(--font-display)] text-2xl font-light mb-3",
              isDark ? "text-white" : "text-[var(--navy)]"
            )}
          >
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className={cn("mb-4", isDark ? "text-white/80" : "text-[var(--mid)]")}>
            {description}
          </p>
        ) : null}
        <iframe
          src={getSubstackEmbedUrl()}
          width="100%"
          height={320}
          className="max-w-full border-0 rounded-xl bg-white min-h-[320px]"
          title="Subscribe to Lifeward Coaching on Substack"
        />
        <p className={cn("mt-3 text-xs", isDark ? "text-white/60" : "text-[var(--mid)]")}>
          {finePrint}
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={className}>
        <div
          className={cn(
            "rounded-xl border p-5",
            isDark
              ? "border-[var(--gold)]/40 bg-white/10 text-[var(--gold-lt)]"
              : "border-green-200 bg-green-50 text-green-900"
          )}
        >
          <p className="font-medium">{successMessage}</p>
          <Link
            href={getSubstackSubscribePageUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-3 inline-block text-sm underline underline-offset-4",
              isDark ? "text-white/90" : "text-[var(--royal)]"
            )}
          >
            Open newsletter on Substack →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {title ? (
        <h2
          className={cn(
            "font-[family-name:var(--font-display)] text-2xl font-light mb-3",
            isDark ? "text-white" : "text-[var(--navy)]"
          )}
        >
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className={cn("mb-6", isDark ? "text-white/80" : "text-[var(--charcoal)]/90")}>
          {description}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className={cn("text-sm", isDark ? "text-white/70" : "text-[var(--mid)]")}>
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="you@example.com"
            autoComplete="email"
            className={cn(
              "mt-2 w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]",
              isDark
                ? "bg-white/10 border border-white/20 text-[var(--cream)] placeholder:text-white/40"
                : "border border-[var(--light)] bg-white text-[var(--charcoal)] placeholder:text-[var(--mid)]"
            )}
          />
        </label>

        {status === "error" && errorMessage ? (
          <p className={cn("text-sm", isDark ? "text-red-200" : "text-red-700")}>{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className={cn(
            "inline-flex w-full cursor-pointer items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed",
            isDark
              ? "bg-[var(--gold)] text-white hover:bg-[#B08424]"
              : "bg-[var(--navy)] text-white hover:bg-[var(--royal)]"
          )}
        >
          {status === "submitting" ? "Subscribing…" : submitLabel}
        </button>
      </form>

      <p className={cn("mt-4 text-xs leading-relaxed", isDark ? "text-white/60" : "text-[var(--mid)]")}>
        {finePrint}{" "}
        <button
          type="button"
          onClick={openSubscribePage}
          className={cn(
            "underline underline-offset-2",
            isDark ? "text-white/80 hover:text-white" : "text-[var(--royal)] hover:text-[var(--navy)]"
          )}
        >
          Or subscribe on Substack
        </button>
      </p>
    </div>
  );
}
