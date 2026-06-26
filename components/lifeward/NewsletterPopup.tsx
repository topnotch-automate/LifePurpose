"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { KitFormEmbed } from "@/components/lifeward/KitFormEmbed";
import { siteConfig } from "@/lib/site-config";
import { isLifewardCoachingHost } from "@/lib/site-url";

const DISMISS_KEY = "lifeward-newsletter-popup-dismissed";
const SUBSCRIBED_KEY = "lifeward-newsletter-popup-subscribed";

export function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [onCoachingSubdomain, setOnCoachingSubdomain] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { enabled, delayMs } = siteConfig.newsletter.popup;
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    setOnCoachingSubdomain(isLifewardCoachingHost(window.location.hostname));
  }, []);

  const closePopup = useCallback(() => {
    setOpen(false);
  }, []);

  const dismissPopup = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
    closePopup();
  }, [closePopup]);

  const handleSubscribed = useCallback(
    ({ requiresConfirmation }: { requiresConfirmation: boolean }) => {
      try {
        localStorage.setItem(SUBSCRIBED_KEY, "1");
      } catch {
        // ignore
      }

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }

      closeTimerRef.current = setTimeout(() => {
        closePopup();
      }, requiresConfirmation ? 4500 : 2200);
    },
    [closePopup]
  );

  useEffect(() => {
    if (!enabled || isAdmin || onCoachingSubdomain) return;

    try {
      if (localStorage.getItem(SUBSCRIBED_KEY) || localStorage.getItem(DISMISS_KEY)) {
        return;
      }
    } catch {
      return;
    }

    const timer = setTimeout(() => setOpen(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, enabled, isAdmin, onCoachingSubdomain]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissPopup();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dismissPopup, open]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (!open || isAdmin || onCoachingSubdomain) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--navy)]/60 backdrop-blur-[2px]"
        aria-label="Close newsletter signup"
        onClick={dismissPopup}
      />

      <div className="relative z-10 flex w-full max-w-2xl max-h-[min(92dvh,100%)] flex-col overflow-hidden rounded-t-2xl border border-[var(--light)] bg-[var(--cream)] shadow-xl sm:max-h-[min(90dvh,calc(100dvh-2rem))] sm:rounded-2xl">
        <div className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-3 border-b border-[var(--light)] bg-[var(--cream)] px-4 py-3 sm:px-6">
          <p className="font-[family-name:var(--font-label)] text-[11px] uppercase tracking-[0.2em] text-[var(--mid)] sm:sr-only">
            Newsletter
          </p>
          <button
            type="button"
            onClick={dismissPopup}
            className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--navy)] hover:bg-[var(--light)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            aria-label="Close newsletter popup"
          >
            <span aria-hidden="true" className="text-3xl leading-none">
              &times;
            </span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 [-webkit-overflow-scrolling:touch]">
          <KitFormEmbed
            source="newsletter:popup"
            showIntro
            compact
            titleId="newsletter-popup-title"
            onSubscribed={handleSubscribed}
          />
        </div>

        <div className="shrink-0 border-t border-[var(--light)] bg-[var(--cream)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
          <button
            type="button"
            onClick={dismissPopup}
            className="w-full py-2 text-center text-sm font-medium text-[var(--mid)] hover:text-[var(--navy)]"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
