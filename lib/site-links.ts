import {
  DEFAULT_SITE_URL,
  LIFEWARD_COACHING_URL,
  getSiteUrl,
} from "@/lib/site-url";

export function getWorkWithMeUrl(): string {
  return `${LIFEWARD_COACHING_URL}/`;
}

export function getMainSiteUrl(): string {
  return getSiteUrl();
}

/** Resolve internal paths for links, accounting for the coaching subdomain. */
export function resolveSiteHref(
  href: string,
  options: { onCoachingSubdomain?: boolean } = {}
): string {
  const { onCoachingSubdomain = false } = options;
  const mainSite = getMainSiteUrl().replace(/\/$/, "");

  if (href === "/work-with-me" || href === "/work-with-me/") {
    return getWorkWithMeUrl();
  }

  if (!href.startsWith("/")) {
    return href;
  }

  if (onCoachingSubdomain) {
    if (href === "/" || href === "") {
      return `${mainSite}/`;
    }
    return `${mainSite}${href}`;
  }

  return href;
}

export function getMainSiteHomeUrl(): string {
  return `${DEFAULT_SITE_URL.replace(/\/$/, "")}/`;
}
