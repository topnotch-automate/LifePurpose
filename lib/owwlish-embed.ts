import { siteConfig } from "@/lib/site-config";

export const OWWLISH_EMBED_SCRIPT =
  "https://app.owwlish.com/integration/js/embed-prod.min.js";

/** Hostnames Owwlish allows for embed API (must match platform settings). */
export function getOwwlishAllowedHosts(): string[] {
  const hosts = new Set(["www.albertblibo.com", "albertblibo.com"]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      hosts.add(new URL(siteUrl).hostname);
    } catch {
      /* ignore invalid URL */
    }
  }
  return [...hosts];
}

export function isOwwlishEmbedSupported(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return getOwwlishAllowedHosts().some(
    (allowed) =>
      normalized === allowed.toLowerCase() ||
      normalized === `www.${allowed.toLowerCase()}` ||
      `www.${normalized}` === allowed.toLowerCase()
  );
}

export function setOwwlishGlobals(): void {
  if (typeof window === "undefined") return;
  window.owwlish_id = siteConfig.course.owwlishId;
  window.owwlish_platform_name = "Static HTML";
}

export function loadOwwlishEmbedScript(): HTMLScriptElement {
  document.querySelectorAll("script[data-owwlish-embed]").forEach((node) => node.remove());

  setOwwlishGlobals();

  const script = document.createElement("script");
  script.src = `${OWWLISH_EMBED_SCRIPT}?t=${Date.now()}`;
  script.async = true;
  script.dataset.owwlishEmbed = "true";
  document.body.appendChild(script);
  return script;
}

declare global {
  interface Window {
    owwlish_id?: string;
    owwlish_platform_name?: string;
  }
}
