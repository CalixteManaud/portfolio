import { getTranslations, setRequestLocale } from "next-intl/server";
import { NextStep } from "@/components/skills/NextStep";
import { SkillsDetails } from "@/components/skills/SkillsDetails";
import { SkillsDomains } from "@/components/skills/SkillsDomains";
import { SkillsHero } from "@/components/skills/SkillsHero";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Skills" });
  return { title: t("title"), description: t("intro") };
}

export default async function SkillsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content">
      <SkillsHero />
      <SkillsDomains />
      <SkillsDetails />
      <NextStep />
    </main>
  );
}
