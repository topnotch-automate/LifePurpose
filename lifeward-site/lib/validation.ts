import { z } from "zod";

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  inquiryType: z.enum(["general", "coaching", "events", "other"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

/**
 * Booking intake form validation schema
 */
export const bookingIntakeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  sessionType: z.enum(["30", "60", "90"]),
  seekingClarity: z.string().min(10, "Please provide more detail").max(500),
  currentChallenges: z.string().max(500).optional(),
  expectations: z.string().max(500).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type BookingIntakeData = z.infer<typeof bookingIntakeSchema>;

