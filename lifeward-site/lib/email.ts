import { Resend } from "resend";
import { config } from "./config";

// Initialize Resend only if API key is available
const resend = config.email.enabled ? new Resend(config.email.apiKey) : null;

export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
}

/**
 * Send email via Resend with graceful fallback
 */
export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  // If Resend is not configured, use fallback
  if (!resend || !config.email.enabled) {
    if (config.email.fallbackToConsole) {
      console.log("📧 Email (fallback - not configured):", {
        to: data.to,
        subject: data.subject,
        html: data.html,
        timestamp: new Date().toISOString(),
      });
      return { success: true };
    }
    return {
      success: false,
      error: "Email service is not configured. Please set RESEND_API_KEY in your environment variables.",
    };
  }

  try {
    const result = await resend.emails.send({
      from: data.from || `${config.email.fromName} <${config.email.fromEmail}>`,
      to: Array.isArray(data.to) ? data.to : [data.to],
      subject: data.subject,
      html: data.html,
      replyTo: data.replyTo || config.email.replyTo,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return {
        success: false,
        error: result.error.message || "Failed to send email",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Send contact form email
 */
export async function sendContactEmail(formData: {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const subject = `New ${formData.inquiryType} inquiry from ${formData.name}`;
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B7355;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Inquiry Type:</strong> ${formData.inquiryType}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #FAFAF9; padding: 16px; border-radius: 4px; margin-top: 8px;">
        ${formData.message.replace(/\n/g, "<br>")}
      </div>
    </div>
  `;

  return sendEmail({
    to: config.site.contactEmail,
    subject,
    html,
    replyTo: formData.email,
  });
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(
  email: string,
  sessionDetails: {
    type: string;
    duration: string;
    date?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const subject = "Session Booking Confirmation - Lifeward";
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B7355;">Thank you for booking a session</h2>
      <p>We have received your booking request for a <strong>${sessionDetails.duration}</strong> ${sessionDetails.type} session.</p>
      ${sessionDetails.date ? `<p><strong>Scheduled for:</strong> ${sessionDetails.date}</p>` : ""}
      <p>We will confirm the details and send you a calendar invitation shortly.</p>
      <p>If you have any questions, please don't hesitate to reach out.</p>
      <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        With clarity,<br>
        Lifeward
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

