import { KIT_FORM_ID } from "@/lib/kit";

export type KitSubscribeResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

/** Subscribe via Kit (ConvertKit) v3 API — requires KIT_API_KEY on the server. */
export async function subscribeToKit(email: string): Promise<KitSubscribeResult> {
  const apiKey =
    process.env.KIT_API_KEY?.trim() || process.env.CONVERTKIT_API_KEY?.trim();

  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      error: "Kit API key is not configured (KIT_API_KEY).",
    };
  }

  const res = await fetch(
    `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ api_key: apiKey, email }),
    }
  );

  const data = (await res.json().catch(() => ({}))) as {
    subscription?: { id?: number };
    subscriber?: { id?: number };
    message?: string;
    error?: string;
  };

  if (res.ok && (data.subscription?.id != null || data.subscriber?.id != null)) {
    return { ok: true };
  }

  const message =
    data.message || data.error || `Kit API returned ${res.status}`;
  console.error("Kit subscribe failed:", res.status, message, data);

  return { ok: false, status: 502, error: message };
}
