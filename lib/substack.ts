import { siteConfig } from "@/lib/site-config";

/** Publication hostname, e.g. lifewardcoaching.substack.com */
export function getSubstackPublicationHost(): string {
  const raw =
    process.env.NEXT_PUBLIC_SUBSTACK_URL?.trim() || siteConfig.substackUrl;
  try {
    const host = new URL(raw.startsWith("http") ? raw : `https://${raw}`).hostname;
    if (!host.endsWith(".substack.com")) {
      throw new Error("not substack");
    }
    return host;
  } catch {
    return "lifewardcoaching.substack.com";
  }
}

export function getSubstackBaseUrl(): string {
  return `https://${getSubstackPublicationHost()}`;
}

/** Public subscribe page */
export function getSubstackSubscribePageUrl(email?: string): string {
  const url = new URL("/subscribe", getSubstackBaseUrl());
  if (email?.trim()) url.searchParams.set("email", email.trim());
  return url.toString();
}

/** Official embed iframe (Settings → Growth → Embed signup form) */
export function getSubstackEmbedUrl(): string {
  return `${getSubstackBaseUrl()}/embed`;
}

/** Endpoint used by Substack's own subscribe forms (server proxy may be blocked). */
export function getSubstackFreeSubscribeUrl(): string {
  return `${getSubstackBaseUrl()}/api/v1/free?nojs=true`;
}
