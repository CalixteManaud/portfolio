import type { Locale } from "@/i18n/config";

const LABELS: Record<Locale, string> = {
  fr: "Aller au contenu principal",
  en: "Skip to main content",
  es: "Saltar al contenido principal",
  de: "Zum Hauptinhalt springen",
};

export function SkipLink({ locale }: { locale: Locale }) {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.70_0.28_240)]"
    >
      {LABELS[locale]}
    </a>
  );
}
