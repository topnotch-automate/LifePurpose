"use client";

import Image from "next/image";
import { FormEvent, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { KIT_FORM_IMAGE_URL } from "@/lib/kit";

interface KitFormEmbedProps {
  className?: string;
  /** Analytics source tag + admin subscriber backup */
  source?: string;
  /** Show headline column from your Kit form design */
  showIntro?: boolean;
  /** Tighter spacing for modal / small screens */
  compact?: boolean;
  /** Optional id for the main heading (e.g. popup aria-labelledby) */
  titleId?: string;
  successMessage?: string;
  onSubscribed?: (options: { requiresConfirmation: boolean }) => void;
}

/**
 * Kit newsletter form — subscribes via /api/kit/subscribe (ConvertKit v3 API).
 * Set KIT_API_KEY in Vercel (Kit → Settings → Advanced → API).
 */
export function KitFormEmbed({
  className,
  source = "kit",
  showIntro = true,
  compact = false,
  titleId,
  successMessage,
  onSubscribed,
}: KitFormEmbedProps) {
  const formId = useId().replace(/:/g, "");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successText, setSuccessText] = useState(
    successMessage ?? "Success! Now check your email to confirm your subscription."
  );

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
          data.error ||
            "Could not subscribe right now. Please try again or contact us."
        );
        return;
      }

      const requiresConfirmation = data.requiresConfirmation ?? true;
      setSuccessText(
        successMessage ??
          (requiresConfirmation
            ? "You're almost in — check your inbox and click the confirmation link to finish subscribing."
            : "You're subscribed. Welcome to the newsletter.")
      );
      setStatus("success");
      setEmail("");
      onSubscribed?.({ requiresConfirmation });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("kit-embed-root", className)}>
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-900">
          <p className="font-medium">{successText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("kit-embed-root", className)}>
      <form
        onSubmit={handleSubmit}
        className="kit-newsletter-form w-full overflow-hidden rounded-xl bg-white shadow-sm"
      >
        <div className="block w-full">
          <div
            className={cn(
              "grid w-full",
              showIntro ? "md:grid-cols-2" : "grid-cols-1"
            )}
          >
            {showIntro ? (
              <div
                className={cn(
                  "relative bg-[#f9fafb]",
                  compact ? "p-4 sm:p-6 md:p-8" : "p-6 md:p-8"
                )}
              >
                <div className="mb-3">
                  <h2
                    id={titleId}
                    className={cn(
                      "font-[family-name:var(--font-display)] font-semibold",
                      compact
                        ? "text-lg sm:text-xl md:text-2xl"
                        : "text-xl md:text-2xl"
                    )}
                    style={{ color: "#c8952a" }}
                  >
                    Join the Lifeward Coaching Newsletter
                  </h2>
                </div>
                <div className="mb-4" style={{ color: "#1a3260" }}>
                  <h3 className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.2em] mb-2">
                    Stay grounded
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Weekly reflections on identity, discipline, and the daily practice of
                    truth — delivered to your inbox.
                  </p>
                </div>
                <div
                  className={cn(
                    "relative aspect-[4/3] w-full overflow-hidden rounded-lg",
                    compact ? "max-h-28 sm:max-h-40" : "max-h-48"
                  )}
                >
                  <Image
                    src={KIT_FORM_IMAGE_URL}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                    unoptimized
                  />
                </div>
              </div>
            ) : null}

            <div
              className={cn(
                "relative z-10 flex flex-col justify-center",
                compact ? "p-4 sm:p-6 md:p-8" : "p-6 md:p-8"
              )}
            >
              <div className="space-y-3 sm:space-y-4">
                <p className="text-sm text-[#1a3260] font-medium leading-snug">
                  Enter your email below, then click Subscribe to join the newsletter.
                </p>
                <div>
                  <label htmlFor={`${formId}-email`} className="sr-only">
                    Email Address
                  </label>
                  <input
                    id={`${formId}-email`}
                    className="w-full rounded border border-[#e3e3e3] px-4 py-3 text-[15px] text-black focus:border-[#1a3260] focus:outline-none focus:ring-2 focus:ring-[#c8952a]/40"
                    name="email_address"
                    aria-label="Email Address"
                    placeholder="Email Address"
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                  />
                </div>

                {status === "error" && errorMessage ? (
                  <p className="text-sm text-red-700">{errorMessage}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full cursor-pointer rounded-full px-6 py-3 text-[15px] font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    color: "#c8952a",
                    backgroundColor: "#faf8f4",
                  }}
                >
                  {status === "submitting" ? "Subscribing…" : "Subscribe"}
                </button>
              </div>
              <p className="mt-4 text-[13px] text-[#4d4d4d]">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
