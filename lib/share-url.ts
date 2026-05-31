/** Absolute URL for social share intents (must work on server render, not only in the browser). */
export function getAbsoluteShareUrl(pathOrUrl: string): string {
  const trimmed = pathOrUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const siteOrigin = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://albertblibo.com"
  ).replace(/\/$/, "");

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${siteOrigin}${path}`;
}
