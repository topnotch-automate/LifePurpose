/** Canonical production host — must match where Vercel serves the site (www). */
export const DEFAULT_SITE_URL = "https://www.albertblibo.com";

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
