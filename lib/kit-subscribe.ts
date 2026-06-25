import { KIT_FORM_ID } from "@/lib/kit";

export type KitSubscribeResult =
  | {
      ok: true;
      requiresConfirmation: boolean;
      state?: string;
    }
  | { ok: false; status: number; error: string };

function resolveKitApiKey(): string | undefined {
  return (
    process.env.KIT_API_KEY?.trim() ||
    process.env.KIT_API_SECRET?.trim() ||
    process.env.CONVERTKIT_API_KEY?.trim() ||
    process.env.CONVERTKIT_API_SECRET?.trim()
  );
}

function isPendingKitState(state: string | undefined): boolean {
  if (!state) return false;
  const normalized = state.toLowerCase();
  return normalized === "inactive" || normalized === "unconfirmed" || normalized === "pending";
}

/** Subscribe via Kit (ConvertKit) v3 API — requires KIT_API_KEY on the server. */
export async function subscribeToKit(email: string): Promise<KitSubscribeResult> {
  const apiKey = resolveKitApiKey();

  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      error:
        "Newsletter signup is not configured. Add KIT_API_KEY (Kit public API key) in Vercel.",
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
    subscription?: { id?: number; state?: string };
    subscriber?: { id?: number; state?: string };
    message?: string;
    error?: string;
  };

  const state = data.subscription?.state || data.subscriber?.state;
  const hasSubscriber =
    data.subscription?.id != null || data.subscriber?.id != null;

  if (res.ok && hasSubscriber) {
    return {
      ok: true,
      requiresConfirmation: isPendingKitState(state),
      state,
    };
  }

  const message =
    data.message || data.error || `Kit API returned ${res.status}`;
  console.error("Kit subscribe failed:", res.status, message, data);

  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      status: 502,
      error:
        "Invalid Kit API key. Use the public API key from Kit → Settings → Advanced → API.",
    };
  }

  return { ok: false, status: 502, error: message };
}
