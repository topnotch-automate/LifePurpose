"use client";

import { useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";

interface KitPopupFormProps {
  onSubscribed: () => void;
  onDismiss: () => void;
}

function isKitSuccessMessage(text: string): boolean {
  const normalized = text.toLowerCase();
  return (
    normalized.includes("success") ||
    normalized.includes("check your email") ||
    normalized.includes("confirm your subscription") ||
    normalized.includes("you're subscribed") ||
    normalized.includes("you are subscribed")
  );
}

/**
 * Loads the Kit-hosted embed script inside the popup modal.
 */
export function KitPopupForm({ onSubscribed, onDismiss }: KitPopupFormProps) {
  const containerId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const subscribedRef = useRef(false);

  const { kitEmbedUid, kitEmbedScriptUrl } = siteConfig.newsletter.popup;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (container.querySelector(`script[data-kit-popup="${kitEmbedUid}"]`)) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = kitEmbedScriptUrl;
    script.dataset.uid = kitEmbedUid;
    script.dataset.kitPopup = kitEmbedUid;
    script.onerror = () => setLoadError(true);
    container.appendChild(script);

    return () => {
      script.remove();
    };
  }, [kitEmbedScriptUrl, kitEmbedUid]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleSuccess = () => {
      if (subscribedRef.current) return;
      subscribedRef.current = true;
      try {
        localStorage.setItem("lifeward-newsletter-popup-subscribed", "1");
      } catch {
        // ignore
      }
      onSubscribed();
    };

    const observer = new MutationObserver(() => {
      const text = container.innerText;
      if (isKitSuccessMessage(text)) {
        handleSuccess();
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const onSubmit = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !container.contains(form)) return;

      const emailInput = form.querySelector('input[type="email"]');
      const email =
        emailInput instanceof HTMLInputElement ? emailInput.value.trim() : "";

      if (!email) return;

      void fetch("/api/kit/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "newsletter:popup",
          pageUrl: window.location.href,
          adminOnly: true,
        }),
      }).catch(() => {
        // Kit embed handles the real subscription; this is admin backup only.
      });
    };

    container.addEventListener("submit", onSubmit, true);

    return () => {
      observer.disconnect();
      container.removeEventListener("submit", onSubmit, true);
    };
  }, [onSubscribed]);

  if (loadError) {
    return (
      <div className="text-sm text-[var(--mid)] space-y-3">
        <p>Could not load the signup form. Please try again later or use the newsletter section on the homepage.</p>
        <button
          type="button"
          onClick={onDismiss}
          className="text-[var(--royal)] font-medium underline underline-offset-4"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div
      id={containerId}
      ref={containerRef}
      className="kit-popup-embed min-h-[120px] w-full [&_form]:!max-w-none"
      data-uid={kitEmbedUid}
    />
  );
}
