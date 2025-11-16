"use server";

import type { Settings } from "@/lib/mongo-operations";
import { getSettings } from "@/lib/mongo-operations";
import nodemailer from "nodemailer";

const MIN_EMAIL_INTERVAL_MS = 1500;
let lastEmailSentAt: number | null = null;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseEmails = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const getAllowedRecipients = (settings: Settings | null) => {
  const allowList = new Set<string>();
  parseEmails(process.env.EMAIL_RECIPIENT_ALLOWLIST).forEach((email) =>
    allowList.add(email)
  );
  parseEmails(process.env.NEXT_PUBLIC_CONTACT_RECEIVER).forEach((email) =>
    allowList.add(email)
  );
  parseEmails(process.env.EMAIL_FROM).forEach((email) => allowList.add(email));
  parseEmails(settings?.email_receiver).forEach((email) => allowList.add(email));
  parseEmails(settings?.smtp_user_emailFrom).forEach((email) =>
    allowList.add(email)
  );
  return Array.from(allowList);
};

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const settings = await getSettings();
  const smtpUser = settings?.smtp_user_emailFrom ?? process.env.SMTP_USER;
  const emailFrom = settings?.smtp_user_emailFrom ?? process.env.EMAIL_FROM;

  if (!smtpUser || !process.env.SMTP_PASS) {
    throw new Error("SMTP_USER or SMTP_PASS environment variable is not set");
  }
  if (!emailFrom) {
    throw new Error("EMAIL_FROM environment variable is not set");
  }

  const allowedRecipients = getAllowedRecipients(settings);
  if (allowedRecipients.length === 0) {
    throw new Error("No allowed email recipients configured");
  }

  const normalizedTo = to.toLowerCase().trim();
  if (!allowedRecipients.includes(normalizedTo)) {
    console.warn(
      `Rejected contact form submission to unauthorized recipient: ${normalizedTo}`
    );
    return {
      success: false,
      message: "Wybrany odbiorca nie jest dozwolony.",
    };
  }

  const now = Date.now();
  if (lastEmailSentAt) {
    const elapsed = now - lastEmailSentAt;
    if (elapsed < MIN_EMAIL_INTERVAL_MS) {
      await sleep(MIN_EMAIL_INTERVAL_MS - elapsed);
    }
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: emailFrom,
    to: normalizedTo,
    subject: subject.trim(),
    text: text.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    lastEmailSentAt = Date.now();
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    lastEmailSentAt = Date.now();
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
}
