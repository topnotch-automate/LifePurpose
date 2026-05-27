"use client";

import Image from "next/image";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getKitFormAction,
  KIT_FORM_IMAGE_URL,
} from "@/lib/kit";

interface KitFormEmbedProps {
  className?: string;
  /** Analytics source tag + admin subscriber backup */
  source?: string;
  /** Show headline column from your Kit form design */
  showIntro?: boolean;
  successMessage?: string;
}

async function captureSubscriberEmail(email: string, source: string, pageUrl: string) {
  await fetch("/api/subscribers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source, pageUrl }),
  }).catch(() => {});
}

/**
 * Inline Kit newsletter form — browser POST to Kit (no ck.js; that script breaks
 * custom markup and can leave the submit button unclickable).
 */
export function KitFormEmbed({
  className,
  source = "kit",
  showIntro = true,
  successMessage = "Success! Now check your email to confirm your subscription.",
}: KitFormEmbedProps) {
  const iframeName = `kit-${useId().replace(/:/g, "")}`;
  const pendingSubmitRef = useRef(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

    void captureSubscriberEmail(trimmed, source, window.location.href);
    // Native POST to Kit from the visitor's browser.
  }

  if (status === "success") {
    return (
      <div className={cn("kit-embed-root", className)}>
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-900">
          <p className="font-medium">{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("kit-embed-root", className)}>
      <iframe
        name={iframeName}
        title="Kit subscription"
        className="sr-only"
        onLoad={handleIframeLoad}
      />

      <form
        action={getKitFormAction()}
        method="post"
        target={iframeName}
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
              <div className="relative bg-[#f9fafb] p-6 md:p-8">
                <div className="mb-3">
                  <h2
                    className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-semibold"
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
                <div className="relative aspect-[4/3] max-h-48 w-full overflow-hidden rounded-lg">
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

            <div className="relative z-10 flex flex-col justify-center p-6 md:p-8">
              <div className="space-y-4">
                <div>
                  <label htmlFor={`${iframeName}-email`} className="sr-only">
                    Email Address
                  </label>
                  <input
                    id={`${iframeName}-email`}
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
