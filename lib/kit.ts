import { siteConfig } from "@/lib/site-config";

export const KIT_FORM_ID =
  process.env.NEXT_PUBLIC_KIT_FORM_ID?.trim() || siteConfig.kitFormId;

/** Kit form POST endpoint (browser submit) */
export function getKitFormAction(): string {
  return `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`;
}

export const KIT_FORM_IMAGE_URL =
  "https://embed.filekitcdn.com/e/n6G4KYgk2rHwpV8T1WhZ2m/mw8XrEPTvtgFcxuGBk4mTc";
