"use client";

import Image from "next/image";
import Script from "next/script";
import { FormEvent, useId } from "react";
import { cn } from "@/lib/utils";
import {
  getKitFormAction,
  KIT_FORM_ID,
  KIT_FORM_IMAGE_URL,
  KIT_FORM_UID,
  KIT_SCRIPT_URL,
} from "@/lib/kit";

interface KitFormEmbedProps {
  className?: string;
  /** Analytics source tag + admin subscriber backup */
  source?: string;
  /** Show headline column from your Kit form design */
  showIntro?: boolean;
}

async function captureSubscriberEmail(email: string, source: string, pageUrl: string) {
  await fetch("/api/subscribers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source, pageUrl }),
  }).catch(() => {});
}

/**
 * Inline Kit (ConvertKit) form — uses your form ID 9491943 with data-format="inline"
 * (modal format from Kit dashboard is hidden on-page; use inline for embeds).
 * @see https://help.kit.com/en/articles/4009572-form-embedding-basics
 */
export function KitFormEmbed({
  className,
  source = "kit",
  showIntro = true,
}: KitFormEmbedProps) {
  const iframeName = `kit-${useId().replace(/:/g, "")}`;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const input = e.currentTarget.elements.namedItem("email_address") as HTMLInputElement | null;
    const email = input?.value?.trim();
    if (email) {
      void captureSubscriberEmail(email, source, window.location.href);
    }
    // Native POST to Kit; ck.js may show inline success without leaving the page.
  }

  return (
    <div className={cn("kit-embed-root", className)}>
      <Script src={KIT_SCRIPT_URL} strategy="lazyOnload" />

      {/* Hidden iframe so Kit response does not navigate the whole page away */}
      <iframe name={iframeName} title="Kit subscription" className="sr-only" />

      <form
        action={getKitFormAction()}
        method="post"
        target={iframeName}
        onSubmit={handleSubmit}
        className="seva-form formkit-form w-full overflow-hidden rounded-xl shadow-sm"
        data-sv-form={KIT_FORM_ID}
        data-uid={KIT_FORM_UID}
        data-format="inline"
        data-version="5"
        style={{ backgroundColor: "#ffffff", borderRadius: "6px" }}
      >
        <div data-style="full" className="block w-full">
          <div
            className={cn(
              "grid w-full",
              showIntro ? "md:grid-cols-2" : "grid-cols-1"
            )}
          >
            {showIntro ? (
              <div
                data-element="column"
                className="formkit-column relative bg-[#f9fafb] p-6 md:p-8"
              >
                <div className="formkit-header mb-3">
                  <h2
                    className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-semibold"
                    style={{ color: "#c8952a" }}
                  >
                    Join the Lifeward Coaching Newsletter
                  </h2>
                </div>
                <div className="formkit-subheader mb-4" style={{ color: "#1a3260" }}>
                  <h3 className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.2em] mb-2">
                    Stay grounded
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Weekly reflections on identity, discipline, and the daily practice of
                    truth — delivered to your inbox.
                  </p>
                </div>
                <div className="formkit-image relative aspect-[4/3] max-h-48 w-full overflow-hidden rounded-lg">
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
              data-element="column"
              className="formkit-column flex flex-col justify-center p-6 md:p-8"
            >
              <div data-element="fields" className="formkit-fields space-y-4">
                <div className="formkit-field">
                  <label htmlFor={`${iframeName}-email`} className="sr-only">
                    Email Address
                  </label>
                  <input
                    id={`${iframeName}-email`}
                    className="formkit-input w-full rounded border border-[#e3e3e3] px-4 py-3 text-[15px] text-black focus:border-[#1a3260] focus:outline-none focus:ring-2 focus:ring-[#c8952a]/40"
                    name="email_address"
                    aria-label="Email Address"
                    placeholder="Email Address"
                    required
                    type="email"
                    autoComplete="email"
                  />
                </div>
                <button
                  data-element="submit"
                  type="submit"
                  className="formkit-submit w-full rounded-full px-6 py-3 text-[15px] font-bold transition-colors hover:opacity-90"
                  style={{
                    color: "#c8952a",
                    backgroundColor: "#faf8f4",
                  }}
                >
                  Subscribe
                </button>
              </div>
              <p className="formkit-guarantee mt-4 text-[13px] text-[#4d4d4d]">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

/** For navy sections — form card stays white; optional outer copy */
export function KitFormEmbedOnDark({
  className,
  source,
  title,
  description,
}: KitFormEmbedProps & { title?: string; description?: string }) {
  return (
    <div className={className}>
      {title ? (
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-light text-white mb-3">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="text-white/85 mb-6 leading-relaxed">{description}</p>
      ) : null}
      <KitFormEmbed source={source} />
    </div>
  );
}
