"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { KitFormEmbed } from "@/components/lifeward/KitFormEmbed";
import { siteConfig } from "@/lib/site-config";

const DISMISS_KEY = "lifeward-newsletter-popup-dismissed";
const SUBSCRIBED_KEY = "lifeward-newsletter-popup-subscribed";

export function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { enabled, delayMs } = siteConfig.newsletter.popup;
  const isAdmin = pathname?.startsWith("/admin");

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
    if (!enabled || isAdmin) return;

    try {
      if (localStorage.getItem(SUBSCRIBED_KEY) || localStorage.getItem(DISMISS_KEY)) {
        return;
      }
    } catch {
      return;
    }

    const timer = setTimeout(() => setOpen(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, enabled, isAdmin]);

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

  if (!open || isAdmin) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
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

      <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--light)] bg-[var(--cream)] shadow-xl p-4 sm:p-6">
        <button
          type="button"
          onClick={dismissPopup}
          className="absolute top-3 right-3 z-10 text-[var(--mid)] hover:text-[var(--navy)] text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <KitFormEmbed
          source="newsletter:popup"
          showIntro
          onSubscribed={handleSubscribed}
        />
      </div>
    </div>
  );
}
