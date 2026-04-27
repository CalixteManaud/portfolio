"use client";

import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState, useTransition } from "react";
import { sendContactMessage } from "@/actions/contact";
import { Turnstile } from "@/components/shared/Turnstile";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; code: string };

type Props = {
  turnstileSiteKey: string;
};

const inputBase =
  "w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-foreground/35 transition-[border-color,box-shadow] focus:border-[oklch(0.70_0.28_240)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.70_0.28_240/0.15)] disabled:opacity-60";

export function ContactForm({ turnstileSiteKey }: Props) {
  const t = useTranslations("Contact");
  const locale = useLocale() as Locale;
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  const handleToken = useCallback((next: string) => setToken(next), []);
  const handleExpire = useCallback(() => setToken(null), []);
  const handleError = useCallback(() => setToken(null), []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setStatus({ kind: "error", code: "captchaFailed" });
      return;
    }
    const formData = new FormData(e.currentTarget);
    const consent = formData.get("consent") === "on";
    if (!consent) {
      setStatus({ kind: "error", code: "validation" });
      return;
    }
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      consent: true as const,
      company: String(formData.get("company") ?? ""),
      turnstileToken: token,
      locale,
    };

    const formEl = e.currentTarget;
    setStatus({ kind: "loading" });
    startTransition(async () => {
      const result = await sendContactMessage(payload);
      if (result?.validationErrors) {
        setStatus({ kind: "error", code: "validation" });
        return;
      }
      const data = result?.data;
      if (!data) {
        setStatus({ kind: "error", code: "sendFailed" });
        return;
      }
      if (data.ok) {
        setStatus({ kind: "success" });
        formEl.reset();
        setToken(null);
        window.turnstile?.reset();
        return;
      }
      const code = data.code;
      const map: Record<string, string> = {
        RATE_LIMITED: "rateLimited",
        CAPTCHA_FAILED: "captchaFailed",
        SEND_FAILED: "sendFailed",
      };
      setStatus({ kind: "error", code: map[code] ?? "sendFailed" });
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-2499.75 top-auto h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={t("fields.name")}>
          <input
            id="name" name="name" type="text" required
            minLength={2} maxLength={120} autoComplete="name"
            placeholder={t("fields.namePlaceholder")}
            disabled={pending} className={inputBase}
          />
        </Field>
        <Field id="email" label={t("fields.email")}>
          <input
            id="email" name="email" type="email" required
            maxLength={254} autoComplete="email"
            placeholder={t("fields.emailPlaceholder")}
            disabled={pending} className={inputBase}
          />
        </Field>
      </div>

      <Field id="subject" label={t("fields.subject")}>
        <input
          id="subject" name="subject" type="text" required
          minLength={2} maxLength={200}
          placeholder={t("fields.subjectPlaceholder")}
          disabled={pending} className={inputBase}
        />
      </Field>

      <Field id="message" label={t("fields.message")}>
        <textarea
          id="message" name="message" required
          minLength={10} maxLength={5000} rows={6}
          placeholder={t("fields.messagePlaceholder")}
          disabled={pending} className={cn(inputBase, "resize-y")}
        />
      </Field>

      <label className="flex cursor-pointer items-start gap-2 text-sm text-foreground/75">
        <input
          type="checkbox" name="consent" required disabled={pending}
          className="mt-0.5 size-4 rounded border-border bg-muted accent-[oklch(0.70_0.28_240)]"
        />
        <span>{t("fields.consent")}</span>
      </label>

      <Turnstile
        siteKey={turnstileSiteKey}
        onToken={handleToken}
        onExpire={handleExpire}
        onError={handleError}
      />

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={pending || !token}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {t("states.loading")}
            </>
          ) : (
            t("submit")
          )}
        </Button>
        <StatusMessage status={status} t={t} />
      </div>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground/85">
        {label}
      </label>
      {children}
    </div>
  );
}

function StatusMessage({
  status, t,
}: {
  status: Status;
  t: ReturnType<typeof useTranslations<"Contact">>;
}) {
  if (status.kind === "idle" || status.kind === "loading") return null;
  if (status.kind === "success") {
    return (
      <p className="text-sm text-[oklch(0.76_0.20_145)]" role="status" aria-live="polite">
        {t("states.success")}
      </p>
    );
  }
  return (
    <p className="text-sm text-destructive" role="alert" aria-live="assertive">
      {t(`errors.${status.code}` as "errors.validation")}
    </p>
  );
}
