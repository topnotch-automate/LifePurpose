export const siteConfig = {
  brandName: "Lifeward Coaching",
  brandTagline: "Lifeward Identity Alignment Method",
  substackUrl:
    process.env.NEXT_PUBLIC_SUBSTACK_URL?.trim() ||
    "https://lifewardcoaching.substack.com/",
  kitFormId: process.env.NEXT_PUBLIC_KIT_FORM_ID?.trim() || "9491943",
  twitterUrl: "https://x.com/TheAlbertBlibo",
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/theincurableoptimist13/discovery-call",
  selarStoreUrl:
    process.env.NEXT_PUBLIC_SELAR_URL?.trim() ||
    "https://selar.com/m/lifeward-coaching",
  freeResourceEnabled: process.env.NEXT_PUBLIC_FREE_RESOURCE_ENABLED === "true",
  course: {
    title:
      process.env.NEXT_PUBLIC_COURSE_TITLE ??
      "How to Clear Confusion, Align Your Life, and Unlock Your Future",
    description:
      process.env.NEXT_PUBLIC_COURSE_DESCRIPTION ??
      "Free pillars on Selar plus a guided course on this site — structured lessons to move from confusion toward clarity, alignment, and purposeful living.",
    homeAnchorId: "online-course",
    pillars: [
      {
        label: "Pillar #1",
        title: "How to Clear Confusion, Align Your Life, and Unlock Your Future",
        url:
          process.env.NEXT_PUBLIC_SELAR_PILLAR_1_URL?.trim() ||
          "https://selar.com/18fe6ex978",
      },
      {
        label: "Pillar #2",
        title: "How to Clear Confusion, Align Your Life, and Unlock Your Future",
        url:
          process.env.NEXT_PUBLIC_SELAR_PILLAR_2_URL?.trim() ||
          "https://selar.com/417p1r8543",
      },
      {
        label: "Pillar #3",
        title: "How to Clear Confusion, Align Your Life, and Unlock Your Future",
        url:
          process.env.NEXT_PUBLIC_SELAR_PILLAR_3_URL?.trim() ||
          "https://selar.com/2e8t7w5m58",
      },
    ],
    embedElementId: "oww-embed-course-all",
    owwlishId: "a196aefe-67c7-491f-9808-c44dda58d3ff",
    embedUrl: process.env.NEXT_PUBLIC_COURSE_EMBED_URL ?? "",
  },
};

export function isPlaceholderUrl(url: string | undefined | null): boolean {
  return !url || url.trim() === "" || url.startsWith("[");
}
