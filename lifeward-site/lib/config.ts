/**
 * Configuration with graceful fallbacks
 * All services work locally without production dependencies
 */

export const config = {
  // Email Service (Resend)
  email: {
    enabled: !!process.env.RESEND_API_KEY,
    apiKey: process.env.RESEND_API_KEY || "",
    fromEmail: process.env.RESEND_FROM_EMAIL || "noreply@lifeward.com",
    fromName: process.env.RESEND_FROM_NAME || "Lifeward",
    replyTo: process.env.RESEND_REPLY_TO || process.env.RESEND_FROM_EMAIL || "noreply@lifeward.com",
    // Fallback: log to console in development
    fallbackToConsole: process.env.NODE_ENV === "development",
  },

  // Booking System (Cal.com / Calendly)
  booking: {
    enabled: !!process.env.NEXT_PUBLIC_CALCOM_USERNAME || !!process.env.NEXT_PUBLIC_CALENDLY_USERNAME,
    // Cal.com
    calcomApiKey: process.env.CALCOM_API_KEY || "",
    calcomUsername: process.env.NEXT_PUBLIC_CALCOM_USERNAME || "",
    // Calendly (alternative)
    calendlyUsername: process.env.NEXT_PUBLIC_CALENDLY_USERNAME || "",
    // Fallback: show contact form or email link
    fallbackToContact: true,
  },

  // Site Configuration
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    name: "Lifeward",
    contactEmail: process.env.CONTACT_EMAIL || "contact@lifeward.com",
  },
} as const;

/**
 * Check if a service is properly configured
 */
export function isServiceConfigured(service: "email" | "booking"): boolean {
  if (service === "email") {
    return config.email.enabled;
  }
  if (service === "booking") {
    return config.booking.enabled;
  }
  return false;
}

