import { getSubstackBaseUrl, getSubstackFreeSubscribeUrl } from "@/lib/substack";

export type SubstackSubscribeResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

/**
 * Server-side Substack free subscribe. May be blocked by Cloudflare from datacenter IPs;
 * use the official Substack embed iframe on the homepage when this fails.
 */
export async function subscribeToSubstack(
  email: string,
  source: string,
  pageUrl?: string
): Promise<SubstackSubscribeResult> {
  const publication = getSubstackBaseUrl();
  const firstUrl = pageUrl?.trim() || publication;
  const referrer = pageUrl?.trim() || publication;

  const body = new URLSearchParams({
    email,
    source: source || "website",
    first_url: firstUrl,
    referrer,
  });

  const res = await fetch(getSubstackFreeSubscribeUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      Origin: publication,
      Referer: `${publication}/`,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    body: body.toString(),
    redirect: "manual",
  });

  // Substack often returns 302 to a thank-you page on success; 200 HTML is also common.
  if (res.status === 200 || res.status === 302 || res.status === 303) {
    return { ok: true };
  }

  if (res.status === 403 || res.status === 429) {
    console.error("Substack subscribe blocked:", res.status);
    return {
      ok: false,
      status: 502,
      error:
        "Substack blocked the server request. Use the embedded signup form or subscribe on Substack directly.",
    };
  }

  const text = await res.text().catch(() => "");
  console.error("Substack subscribe failed:", res.status, text.slice(0, 200));

  return {
    ok: false,
    status: 502,
    error: `Substack subscribe failed (${res.status}). Try subscribing on Substack directly.`,
  };
}
