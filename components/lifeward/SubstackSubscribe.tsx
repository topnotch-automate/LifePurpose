"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getSubstackEmbedUrl,
  getSubstackFreeSubscribeUrl,
  getSubstackSubscribePageUrl,
} from "@/lib/substack";

type SubstackSubscribeVariant = "form" | "embed";
type SubstackSubscribeTheme = "light" | "dark";

interface SubstackSubscribeProps {
  /** `form` = browser POST to Substack (required — server proxies get 403); `embed` = official iframe */
  variant?: SubstackSubscribeVariant;
  theme?: SubstackSubscribeTheme;
  className?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
  /** Passed to Substack as `source` (analytics in Substack dashboard) */
  source?: string;
  finePrint?: string;
}

export function SubstackSubscribe({
  variant = "form",
  theme = "light",
  className,
  title,
  description,
  submitLabel = "Subscribe",
  successMessage = "Thank you. Check your inbox to confirm your subscription on Substack.",
  source = "website",
  finePrint = "By subscribing, you agree to Substack's terms. You can unsubscribe anytime.",
}: SubstackSubscribeProps) {
  const iframeName = `substack-${useId().replace(/:/g, "")}`;
  const pendingSubmitRef = useRef(false);
  const [pageUrl, setPageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isDark = theme === "dark";
  const action = getSubstackFreeSubscribeUrl();

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (status !== "submitting") return;

    const timeout = window.setTimeout(() => {
      if (!pendingSubmitRef.current) return;
      pendingSubmitRef.current = false;
      setStatus("success");
      setEmail("");
    }, 10000);

    return () => window.clearTimeout(timeout);
  }, [status]);

  function handleIframeLoad() {
    if (!pendingSubmitRef.current) return;
    pendingSubmitRef.current = false;
    setStatus("success");
    setEmail("");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const trimmed = email.trim();

    if (!trimmed || !trimmed.includes("@")) {
      e.preventDefault();
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    pendingSubmitRef.current = true;

    const form = e.currentTarget;
    const firstUrlInput = form.elements.namedItem("first_url") as HTMLInputElement | null;
    const referrerInput = form.elements.namedItem("referrer") as HTMLInputElement | null;
    const url = window.location.href;
    if (firstUrlInput) firstUrlInput.value = url;
    if (referrerInput) referrerInput.value = document.referrer || url;

    // Backup capture for admin (in case Substack subscribe fails)
    void fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed, source, pageUrl: url }),
    }).catch(() => {});

    // Native form POST to Substack from the visitor's browser (not our server).
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
          className="max-w-full border-0 rounded-xl bg-white"
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

      <iframe
        name={iframeName}
        title="Substack subscription"
        className="sr-only"
        onLoad={handleIframeLoad}
      />

      <form
        action={action}
        method="POST"
        target={iframeName}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="first_url" value={pageUrl} />
        <input type="hidden" name="referrer" value={pageUrl} />

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
          <p className={cn("text-sm", isDark ? "text-white/80" : "text-red-700")}>{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className={cn(
            "inline-flex w-full items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed",
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
