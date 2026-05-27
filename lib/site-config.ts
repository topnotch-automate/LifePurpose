export const siteConfig = {
  brandName: "Lifeward Coaching",
  brandTagline: "Lifeward Identity Alignment Method",
  substackUrl:
    process.env.NEXT_PUBLIC_SUBSTACK_URL?.trim() ||
    "https://lifewardcoaching.substack.com/",
  kitLandingUrl:
    process.env.NEXT_PUBLIC_KIT_LANDING_URL?.trim() ||
    "https://lifeward-coaching.kit.com/15b19d6404",
  twitterUrl: "https://x.com/TheAlbertBlibo",
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/theincurableoptimist13/discovery-call",
  freeResourceEnabled: process.env.NEXT_PUBLIC_FREE_RESOURCE_ENABLED === "true",
  course: {
    title: process.env.NEXT_PUBLIC_COURSE_TITLE ?? "Online Course",
    description:
      process.env.NEXT_PUBLIC_COURSE_DESCRIPTION ??
      "Start the course directly here — structured guidance for understanding and daily practice.",
    homeAnchorId: "online-course",
    embedElementId: "oww-embed-course-all",
    owwlishId: "a196aefe-67c7-491f-9808-c44dda58d3ff",
    embedUrl: process.env.NEXT_PUBLIC_COURSE_EMBED_URL ?? "",
  },
};

export function isPlaceholderUrl(url: string | undefined | null): boolean {
  return !url || url.trim() === "" || url.startsWith("[");
}
