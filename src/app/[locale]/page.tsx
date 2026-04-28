import { getTranslations, setRequestLocale } from "next-intl/server";
import { DevOpsShowcase } from "@/components/sections/DevOpsShowcase";
import { Hero } from "@/components/sections/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/i18n/config";
import { env } from "@/lib/env";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Meta" });
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Calixte Manaud",
          alternateName: "Warthoz",
          url: baseUrl,
          jobTitle: "DevOps · DevSecOps · Web Developer",
          description: t("description"),
          sameAs: ["https://github.com/CalixteManaud"],
          knowsAbout: [
            "DevOps",
            "DevSecOps",
            "CI/CD",
            "Kubernetes",
            "Terraform",
            "Next.js",
            "React",
            "TypeScript",
          ],
        }}
      />
      <Hero />
      <DevOpsShowcase />
    </main>
  );
}
