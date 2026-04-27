import { setRequestLocale } from "next-intl/server";
import { DevOpsShowcase } from "@/components/sections/DevOpsShowcase";
import { Hero } from "@/components/sections/Hero";
import type { Locale } from "@/i18n/config";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <DevOpsShowcase />
    </main>
  );
}
