import { siteConfig } from "@/lib/site-config";

/** Hosted Kit (ConvertKit) landing page — full-page signup + lead magnet */
export function getKitLandingUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_KIT_LANDING_URL?.trim();
  return fromEnv || siteConfig.kitLandingUrl;
}
