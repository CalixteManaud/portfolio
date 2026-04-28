import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "@/styles/globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { SkipLink } from "@/components/shared/SkipLink";
import { type Locale, locales } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import { env } from "@/lib/env";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-code",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
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

  const t = await getTranslations({ locale, namespace: "Meta" });
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    metadataBase: new URL(baseUrl),
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("description"),
    icons: { icon: "/favicon.svg" },
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
          url: `${baseUrl}/api/og?title=${encodeURIComponent(t("title"))}&type=default`,
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
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(t("title"))}&type=default`],
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
      className={`dark ${GeistSans.variable} ${GeistMono.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <NextIntlClientProvider>
          <ClientProviders>
            <SkipLink locale={locale as Locale} />
            <Header />
            <div id="main-content" className="contents">
              {children}
            </div>
            <Footer />
          </ClientProviders>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
