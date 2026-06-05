/** Absolute URL for social share intents (must work on server render, not only in the browser). */
import { getSiteUrl } from "./site-url";

export function getAbsoluteShareUrl(pathOrUrl: string): string {
  const trimmed = pathOrUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const siteOrigin = getSiteUrl();

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${siteOrigin}${path}`;
}
