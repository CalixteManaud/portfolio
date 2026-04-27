import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/sections/ContactForm";
import type { Locale } from "@/i18n/config";
import { env } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("title") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <main className="mx-auto max-w-2xl px-6 pt-32 pb-24">
      <header className="mb-10 space-y-3">
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-foreground/75 leading-relaxed">{t("intro")}</p>
      </header>

      <ContactForm turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
    </main>
  );
}
