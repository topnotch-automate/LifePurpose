import nodemailer from "nodemailer";

export const CONTACT_INBOX = "lifewardcoach@yahoo.com";

export function getContactInbox(): string {
  return process.env.CONTACT_EMAIL?.trim() || CONTACT_INBOX;
}

function getSmtpConfig() {
  const user = process.env.SMTP_USER?.trim() || getContactInbox();
  const password = process.env.SMTP_PASSWORD?.trim();
  const host = process.env.SMTP_HOST?.trim() || "smtp.mail.yahoo.com";
  const port = Number(process.env.SMTP_PORT) || 465;

  return { user, password, host, port };
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { user, password, host, port } = getSmtpConfig();

  if (!password) {
    return {
      ok: false,
      error:
        "Contact form is not configured yet. Email lifewardcoach@yahoo.com directly.",
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  const to = getContactInbox();
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  try {
    await transporter.sendMail({
      from: `"Lifeward Coaching Website" <${user}>`,
      to,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New contact form message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
        <hr>
        <p style="color:#666;font-size:12px;">Sent from the contact form on albertblibo.com</p>
      `,
      text: [
        "New contact form message",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
        "",
        "---",
        "Sent from the contact form on albertblibo.com",
      ].join("\n"),
    });

    return { ok: true };
  } catch (error) {
    console.error("Contact email send failed:", error);
    return {
      ok: false,
      error: "Could not send your message right now. Please email lifewardcoach@yahoo.com directly.",
    };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
