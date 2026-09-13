import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactClose } from "@/components/landing/ContactClose";
import { DailySection } from "@/components/landing/DailySection";
import { EcosystemSection } from "@/components/landing/EcosystemSection";
import { ExpertiseSection } from "@/components/landing/ExpertiseSection";
import { JourneySection } from "@/components/landing/JourneySection";
import { LandingHero } from "@/components/landing/LandingHero";
import { ProjectsSpotlight } from "@/components/landing/ProjectsSpotlight";
import { ProofBand } from "@/components/landing/ProofBand";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/i18n/config";
import { env } from "@/lib/env";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Meta" });
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  return (
    <main id="main-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Manaud Calixte",
          givenName: "Calixte",
          familyName: "Manaud",
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
      <LandingHero />
      <ExpertiseSection />
      <EcosystemSection />
      <DailySection />
      <JourneySection locale={locale} />
      <ProjectsSpotlight locale={locale} />
      <ProofBand locale={locale} />
      <ContactClose />
    </main>
  );
}
