/** Canonical production host — must match where Vercel serves the site (www). */
export const DEFAULT_SITE_URL = "https://www.albertblibo.com";

/** Dedicated coaching landing subdomain (work-with-me). */
export const LIFEWARD_COACHING_HOST =
  process.env.NEXT_PUBLIC_LIFEWARD_COACHING_HOST?.trim() ||
  "lifewardcoaching.albertblibo.com";

export const LIFEWARD_COACHING_URL = (
  process.env.NEXT_PUBLIC_LIFEWARD_COACHING_URL?.trim() ||
  `https://${LIFEWARD_COACHING_HOST}`
).replace(/\/$/, "");

export function isLifewardCoachingHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase().split(":")[0];
  return normalized === LIFEWARD_COACHING_HOST.toLowerCase();
}

export function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");

  try {
    const url = new URL(raw);
    // Apex redirects to www in production; canonicals must match the served host.
    if (url.hostname === "albertblibo.com") {
      url.hostname = "www.albertblibo.com";
    }
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
