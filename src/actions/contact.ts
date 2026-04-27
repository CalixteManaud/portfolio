"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { ContactEmail } from "@/emails/ContactEmail";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import { getResend } from "@/lib/resend";
import { actionClient } from "@/lib/safe-action";
import { verifyTurnstile } from "@/lib/turnstile";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1h

const localeSchema = z.enum(["fr", "en", "es", "de"]);

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email().max(254),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
  consent: z.literal(true, {
    error: "Consent required",
  }),
  // Honeypot — must remain empty.
  company: z.string().max(0).optional().default(""),
  turnstileToken: z.string().min(1, "Captcha required"),
  locale: localeSchema.default("fr"),
});

export type ContactErrorCode =
  | "VALIDATION"
  | "CAPTCHA_FAILED"
  | "RATE_LIMITED"
  | "SEND_FAILED"
  | "HONEYPOT";

export const sendContactMessage = actionClient
  .metadata({ actionName: "sendContactMessage" })
  .inputSchema(contactSchema)
  .action(async ({ parsedInput }) => {
    const {
      name,
      email,
      subject,
      message,
      company,
      turnstileToken,
      locale,
    } = parsedInput;

    if (company && company.length > 0) {
      // Bot tripped the honeypot — pretend success to avoid signal.
      return { ok: true as const };
    }

    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      "unknown";
    const userAgent = h.get("user-agent") ?? undefined;

    const limit = rateLimit(
      `contact:${ip}`,
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!limit.ok) {
      return {
        ok: false as const,
        code: "RATE_LIMITED" as ContactErrorCode,
      };
    }

    const captchaOk = await verifyTurnstile(turnstileToken, ip);
    if (!captchaOk) {
      return {
        ok: false as const,
        code: "CAPTCHA_FAILED" as ContactErrorCode,
      };
    }

    try {
      const resend = getResend();
      const result = await resend.emails.send({
        from: env.CONTACT_EMAIL_FROM,
        to: env.CONTACT_EMAIL_TO,
        replyTo: email,
        subject: `[Portfolio] ${subject}`,
        react: ContactEmail({
          name,
          email,
          subject,
          message,
          locale,
          ip,
          userAgent,
        }),
      });

      if (result.error) {
        console.error("[contact] Resend error:", result.error);
        return {
          ok: false as const,
          code: "SEND_FAILED" as ContactErrorCode,
        };
      }

      return { ok: true as const };
    } catch (err) {
      console.error("[contact] Unexpected error:", err);
      return {
        ok: false as const,
        code: "SEND_FAILED" as ContactErrorCode,
      };
    }
  });
