"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import {
  isOwwlishEmbedSupported,
  loadOwwlishEmbedScript,
  setOwwlishGlobals,
} from "@/lib/owwlish-embed";

type EmbedStatus = "loading" | "ready" | "unsupported-host" | "failed";

const LIVE_COURSE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.albertblibo.com") +
  "/course";

function injectStylesheet(href: string) {
  if (document.querySelector(`link[data-owwlish-css="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.owwlishCss = href;
  document.head.appendChild(link);
}

async function loadProxiedEmbed(container: HTMLElement): Promise<boolean> {
  const res = await fetch("/api/owwlish-embed");
  if (!res.ok) return false;

  const data = (await res.json()) as { html?: string; cssTemplate?: string };
  if (!data.html) return false;

  container.innerHTML = data.html;
  if (data.cssTemplate) injectStylesheet(data.cssTemplate);
  return true;
}

export function OwwlishCourseEmbed() {
  const containerId = siteConfig.course.embedElementId;
  const [status, setStatus] = useState<EmbedStatus>("loading");

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) {
      setStatus("failed");
      return;
    }

    let cancelled = false;
    const hostname = window.location.hostname;
    const supportedHost = isOwwlishEmbedSupported(hostname);

    const markReadyIfPopulated = () => {
      if (cancelled) return;
      if (container.innerHTML.trim().length > 0) {
        setStatus("ready");
      }
    };

    const failTimer = window.setTimeout(() => {
      if (cancelled || container.innerHTML.trim().length > 0) return;
      setStatus(supportedHost ? "failed" : "unsupported-host");
    }, 6000);

    const init = async () => {
      container.innerHTML = "";
      setOwwlishGlobals();

      if (!supportedHost) {
        const ok = await loadProxiedEmbed(container);
        if (cancelled) return;
        if (ok) {
          setStatus("ready");
          window.clearTimeout(failTimer);
          return;
        }
        setStatus("unsupported-host");
        window.clearTimeout(failTimer);
        return;
      }

      const script = loadOwwlishEmbedScript();
      script.addEventListener("load", () => {
        window.setTimeout(markReadyIfPopulated, 500);
      });
      script.addEventListener("error", () => {
        if (!cancelled) setStatus("failed");
      });
    };

    void init();

    const observer = new MutationObserver(markReadyIfPopulated);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      window.clearTimeout(failTimer);
      observer.disconnect();
      document.querySelectorAll("script[data-owwlish-embed]").forEach((node) => node.remove());
      container.innerHTML = "";
    };
  }, [containerId]);

  return (
    <div>
      <div id={containerId} className="min-h-[200px]" aria-busy={status === "loading"} />

      {status === "loading" && (
        <p className="mt-4 text-center text-sm text-[var(--mid)]">Loading course…</p>
      )}

      {status === "unsupported-host" && (
        <div className="mt-4 rounded-lg border border-[var(--light)] bg-[var(--sky)]/40 px-4 py-4 text-center text-sm text-[var(--charcoal)]">
          <p className="font-medium text-[var(--navy)]">Course preview unavailable on this URL</p>
          <p className="mt-2 text-[var(--mid)]">
            Owwlish only serves the embed on the live domain (for example{" "}
            <span className="whitespace-nowrap">www.albertblibo.com</span>). On localhost or
            preview deployments the player stays empty unless proxied.
          </p>
          <Link
            href={LIVE_COURSE_URL}
            className="mt-3 inline-flex text-[var(--royal)] font-medium underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open course on the live site →
          </Link>
        </div>
      )}

      {status === "failed" && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-center text-sm text-red-800">
          <p className="font-medium">Could not load the course</p>
          <p className="mt-2">
            Try refreshing the page. If it persists, open the course on the live site.
          </p>
          <Link
            href={LIVE_COURSE_URL}
            className="mt-3 inline-flex font-medium underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open course on the live site →
          </Link>
        </div>
      )}
    </div>
  );
}
