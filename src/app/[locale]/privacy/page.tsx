import { getTranslations, setRequestLocale } from "next-intl/server";
import { EditorialPage } from "@/components/sections/EditorialPage";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  return { title: t("privacy.title"), description: t("privacy.description") };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EditorialPage slug="privacy" locale={locale} />;
}
