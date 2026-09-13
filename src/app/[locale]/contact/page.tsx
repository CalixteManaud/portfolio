import { getTranslations, setRequestLocale } from "next-intl/server";
import { Kicker } from "@/components/about/Kicker";
import { ContactBottom, ContactIntents } from "@/components/contact/ContactExtras";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/sections/ContactForm";
import type { Locale } from "@/i18n/config";
import { env } from "@/lib/env";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("title"), description: t("intro") };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact.form");

  return (
    <main id="main-content">
      <ContactHero />

      <div className="mx-auto w-[min(100%-2.5rem,82.5rem)]">
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <section
            aria-labelledby="form-title"
            className="rounded-2xl border border-rule bg-chalk p-5 shadow-lift-1 sm:p-7 lg:p-8"
          >
            <Kicker>{t("kicker")}</Kicker>
            <h2
              id="form-title"
              className="mt-3 text-[clamp(1.6rem,2.2vw,1.9rem)] font-bold leading-[1.05] tracking-[-0.03em] text-ink"
            >
              {t("title")}
            </h2>
            <p className="mt-2 text-[13.5px] text-ink-soft">{t("intro")}</p>
            <div className="mt-6">
              <ContactForm turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
            </div>
          </section>

          <ContactInfo />
        </div>

        <ContactIntents />
        <ContactBottom />
      </div>
    </main>
  );
}
