import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import {
  Be_Vietnam_Pro as BeVietnamPro,
  JetBrains_Mono,
  Waiting_for_the_Sunrise as WaitingForTheSunrise,
} from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "@/styles/globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { SkipLink } from "@/components/shared/SkipLink";
import { ThemeScript } from "@/components/shared/ThemeScript";
import { type Locale, locales } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import { env } from "@/lib/env";

/* `latin-ext` est obligatoire partout : le site sert DE/ES/FR (ä, ö, ü, ñ, é, ç).
   next/font exige des littéraux statiques — pas de constante partagée ici. */

/** Voix et lecture — la face que la mesure de la maquette a désignée pour
 *  les titres, reprise pour le texte courant : une seule famille, quatre graisses. */
const beVietnam = BeVietnamPro({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vietnam",
  display: "swap",
});

/** Donnée — terminal, journaux de build, étiquettes techniques. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/** Main courante — les deux annotations manuscrites de la landing. La face
 *  n'existe qu'en sous-ensemble latin, qui couvre les caractères employés
 *  dans les quatre langues de ces annotations. */
const sunrise = WaitingForTheSunrise({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sunrise",
  // Pas de métriques de repli connues pour cette face : sans cette option,
  // next/font avertit à chaque build. Deux annotations décoratives n'en ont pas besoin.
  adjustFontFallback: false,
  display: "swap",
});

export const viewport: Viewport = {
  // Conversion sRGB exacte de --board dans globals.css : le fond de page.
  // Doit suivre le thème clair, qui est le thème par défaut du site.
  themeColor: "#F6F1EA",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const [t, tHero] = await Promise.all([
    getTranslations({ locale, namespace: "Meta" }),
    getTranslations({ locale, namespace: "Hero" }),
  ]);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  /* La vignette partagée porte un fait, pas un écho du titre : le titre dit déjà
     qui et quel métier, le sous-titre dit donc à quelles conditions on peut
     travailler ensemble — la seule chose qu'un recruteur ne peut pas deviner. */
  const ogUrl = `${baseUrl}/api/og?title=${encodeURIComponent(
    t("title"),
  )}&subtitle=${encodeURIComponent(tHero("availability"))}&type=default`;

  return {
    metadataBase: new URL(baseUrl),
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("description"),
    icons: { icon: "/favicon.ico" },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}`])),
    },
    openGraph: {
      type: "website",
      locale,
      url: baseUrl,
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [ogUrl],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale as Locale);

  return (
    <html
      lang={locale}
      className={`${beVietnam.variable} ${jetbrainsMono.variable} ${sunrise.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <NextIntlClientProvider>
          <ClientProviders>
            <SkipLink locale={locale as Locale} />
            <Header />
            {children}
            <Footer />
          </ClientProviders>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
