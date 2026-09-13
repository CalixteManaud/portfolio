"use client";

import {
  Building2,
  ChevronDown,
  List,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useCallback, useEffect, useState, useTransition } from "react";
import { sendContactMessage } from "@/actions/contact";
import { Turnstile } from "@/components/shared/Turnstile";
import { Checkbox } from "@/components/ui/checkbox";
import type { Locale } from "@/i18n/config";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; code: string };

type FieldId = "name" | "email" | "subject" | "message" | "consent";
type FieldErrors = Partial<Record<FieldId, string>>;

type Props = {
  turnstileSiteKey: string;
};

const SUBJECTS = ["recruitment", "mission", "advice", "hello", "other"] as const;
/** L'ordre du formulaire : le premier champ en erreur reçoit le focus. */
const FIELD_ORDER: FieldId[] = ["name", "email", "subject", "message", "consent"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const control =
  "w-full rounded-xl border border-rule bg-chalk text-[14px] text-ink transition-[border-color] placeholder:text-ink-soft focus-visible:border-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper aria-invalid:border-destructive disabled:opacity-60";

/** Les attributs qui relient un champ à son message d'erreur. */
function errorProps(id: FieldId, errors: FieldErrors) {
  return errors[id]
    ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` }
    : { "aria-invalid": undefined, "aria-describedby": undefined };
}

/** Le thème du site (bouton clair/sombre), que Turnstile doit suivre
 *  plutôt que le réglage du système. */
function useSiteTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/** Un champ du formulaire. Pour les champs d'une ligne, le libellé reste
 *  lisible par les lecteurs d'écran et l'indication sert d'étiquette visuelle,
 *  comme sur la maquette. Le message garde un libellé visible. */
function FieldShell({
  id,
  label,
  icon,
  error,
  children,
  multiline = false,
}: {
  id: FieldId | "organization";
  label: string;
  icon: ReactNode;
  error?: string;
  children: ReactNode;
  multiline?: boolean;
}) {
  return (
    <div>
      <div className="relative">
        <label
          htmlFor={id}
          className={
            multiline
              ? "pointer-events-none absolute top-3.5 left-11 text-[13px] font-medium text-ink"
              : "sr-only"
          }
        >
          {label}
          {multiline ? <span aria-hidden="true"> *</span> : null}
        </label>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-4 text-ink-soft ${multiline ? "top-3.5" : "top-1/2 -translate-y-1/2"}`}
        >
          {icon}
        </span>
        {children}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 pl-1 text-[12.5px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm({ turnstileSiteKey }: Props) {
  const t = useTranslations("Contact");
  const locale = useLocale() as Locale;
  const theme = useSiteTheme();
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();

  const handleToken = useCallback((next: string) => setToken(next), []);
  const handleExpire = useCallback(() => setToken(null), []);
  const handleError = useCallback(() => setToken(null), []);

  const clearError = useCallback((id: string) => {
    setErrors((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id as FieldId];
      return next;
    });
  }, []);

  const showErrors = (next: FieldErrors) => {
    setErrors(next);
    setStatus({ kind: "error", code: "validation" });
    const first = FIELD_ORDER.find((id) => next[id]);
    if (first) document.getElementById(first)?.focus();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const read = (key: string) => String(formData.get(key) ?? "").trim();

    // Les mêmes règles que le schéma Zod du serveur, vérifiées avant l'envoi
    // pour signaler chaque champ à sa place.
    const subjectKey = read("subject");
    const found: FieldErrors = {};
    if (read("name").length < 2) found.name = t("fieldErrors.name");
    if (!EMAIL_RE.test(read("email"))) found.email = t("fieldErrors.email");
    if (!(SUBJECTS as readonly string[]).includes(subjectKey)) {
      found.subject = t("fieldErrors.subject");
    }
    if (read("message").length < 10) found.message = t("fieldErrors.message");
    if (formData.get("consent") !== "on") found.consent = t("fieldErrors.consent");
    if (Object.keys(found).length > 0) {
      showErrors(found);
      return;
    }
    setErrors({});

    if (!token) {
      setStatus({ kind: "error", code: "captchaFailed" });
      return;
    }

    // Le sujet part sous son libellé traduit : c'est lui qui se lit dans la
    // boîte de réception, pas un identifiant technique.
    const payload = {
      name: read("name"),
      email: read("email"),
      organization: read("organization"),
      subject: t(`subjects.${subjectKey as (typeof SUBJECTS)[number]}`),
      message: read("message"),
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
        const rejected = result.validationErrors as Record<string, unknown>;
        const mapped: FieldErrors = {};
        for (const id of FIELD_ORDER) {
          if (rejected[id]) mapped[id] = t(`fieldErrors.${id}`);
        }
        if (Object.keys(mapped).length > 0) showErrors(mapped);
        else setStatus({ kind: "error", code: "captchaFailed" });
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
      const map: Record<string, string> = {
        RATE_LIMITED: "rateLimited",
        CAPTCHA_FAILED: "captchaFailed",
        SEND_FAILED: "sendFailed",
      };
      setStatus({ kind: "error", code: map[data.code] ?? "sendFailed" });
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      onInput={(e) => clearError((e.target as HTMLInputElement).name)}
      noValidate
      className="space-y-4"
    >
      {/* Honeypot. Le libellé reste en anglais et hors i18n, délibérément : un
          piège à bots doit ressembler au champ standard que les robots
          reconnaissent et remplissent. Le vrai champ entreprise s'appelle donc
          « organization », pour ne jamais se confondre avec lui. */}
      <div aria-hidden="true" className="absolute -left-2499.75 top-auto h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldShell
          id="name"
          label={t("fields.name")}
          icon={<UserRound className="size-[18px]" />}
          error={errors.name}
        >
          <input
            id="name"
            name="name"
            type="text"
            required
            aria-required="true"
            minLength={2}
            maxLength={120}
            autoComplete="name"
            placeholder={t("fields.namePlaceholder")}
            disabled={pending}
            className={`${control} h-12 pr-4 pl-11`}
            {...errorProps("name", errors)}
          />
        </FieldShell>
        <FieldShell
          id="email"
          label={t("fields.email")}
          icon={<Mail className="size-[18px]" />}
          error={errors.email}
        >
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            maxLength={254}
            autoComplete="email"
            placeholder={t("fields.emailPlaceholder")}
            disabled={pending}
            className={`${control} h-12 pr-4 pl-11`}
            {...errorProps("email", errors)}
          />
        </FieldShell>
      </div>

      <FieldShell
        id="organization"
        label={t("fields.organization")}
        icon={<Building2 className="size-[18px]" />}
      >
        <input
          id="organization"
          name="organization"
          type="text"
          maxLength={160}
          autoComplete="organization"
          placeholder={t("fields.organizationPlaceholder")}
          disabled={pending}
          className={`${control} h-12 pr-4 pl-11`}
        />
      </FieldShell>

      <FieldShell
        id="subject"
        label={t("fields.subject")}
        icon={<List className="size-[18px]" />}
        error={errors.subject}
      >
        <select
          id="subject"
          name="subject"
          required
          aria-required="true"
          defaultValue=""
          disabled={pending}
          className={`${control} h-12 appearance-none pr-11 pl-11 invalid:text-ink-soft`}
          {...errorProps("subject", errors)}
        >
          <option value="" disabled>
            {t("fields.subjectPlaceholder")}
          </option>
          {SUBJECTS.map((key) => (
            <option key={key} value={key}>
              {t(`subjects.${key}`)}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-soft"
        />
      </FieldShell>

      <FieldShell
        id="message"
        label={t("fields.message")}
        icon={<MessageCircle className="size-[18px]" />}
        error={errors.message}
        multiline
      >
        <textarea
          id="message"
          name="message"
          required
          aria-required="true"
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder={t("fields.messagePlaceholder")}
          disabled={pending}
          className={`${control} min-h-44 resize-y pt-10 pr-4 pb-3.5 pl-11 leading-relaxed`}
          {...errorProps("message", errors)}
        />
      </FieldShell>

      <div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            name="consent"
            required
            disabled={pending}
            onCheckedChange={() => clearError("consent")}
            className="mt-0.5 border-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper data-checked:border-copper data-checked:bg-copper data-checked:text-copper-ink"
            {...errorProps("consent", errors)}
          />
          <label htmlFor="consent" className="text-[13px] leading-relaxed text-ink-soft">
            {t("fields.consent")}
          </label>
        </div>
        {errors.consent ? (
          <p id="consent-error" className="mt-1.5 pl-7 text-[12.5px] text-destructive">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <Turnstile
        siteKey={turnstileSiteKey}
        onToken={handleToken}
        onExpire={handleExpire}
        onError={handleError}
        theme={theme}
      />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-copper text-[14.5px] font-semibold text-copper-ink shadow-lift-2 transition-[background-color,transform] hover:-translate-y-px hover:bg-copper-deep disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {t("states.loading")}
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            {t("submit")}
          </>
        )}
      </button>

      {/* Régions d'annonce toujours présentes : un lecteur d'écran annonce
          de façon fiable un changement de contenu, moins une insertion. */}
      <p role="status" className="text-sm text-go empty:hidden">
        {status.kind === "success" ? t("states.success") : null}
      </p>
      <p role="alert" className="text-sm text-destructive empty:hidden">
        {status.kind === "error" ? t(`errors.${status.code}` as "errors.validation") : null}
      </p>
    </form>
  );
}
