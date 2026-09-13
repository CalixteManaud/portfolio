import withBundleAnalyzer from "@next/bundle-analyzer";
// `@sentry/nextjs` n'expose pas de sous-chemin `/config` : `withSentryConfig`
// est réexporté depuis la racine du paquet. Le sous-chemin passait tant qu'une
// ancienne version le tolérait, et casse le typecheck depuis la 10.49.
import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isDev = process.env.NODE_ENV !== "production";

// Allowance dev-only pour le sélecteur du mode live d'Impeccable (localhost:8400).
// Gardée par `isDev` : la CSP de production est strictement inchangée.
const __impeccableLiveDev = isDev ? " http://localhost:8400" : "";

// CSP: dev needs 'unsafe-eval' (HMR/Turbopack) and 'unsafe-inline'.
// In prod we keep 'unsafe-inline' for now; harden with nonces via middleware later.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://static.cloudflareinsights.com https://*.vercel-insights.com${__impeccableLiveDev}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.sentry.io https://*.ingest.sentry.io https://challenges.cloudflare.com https://*.vercel-insights.com https://api.github.com${__impeccableLiveDev}`,
  "frame-src 'self' https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei"],
  },
  /** La section Rencontres a été retirée. Ses URL localisées ont pu être
   *  partagées ou indexées : elles renvoient donc en 301 vers l'accueil plutôt
   *  que de servir un 404. */
  async redirects() {
    return ["/rencontres", "/meetings", "/encuentros", "/begegnungen"].flatMap((path) => [
      { source: path, destination: "/", permanent: true },
      { source: `${path}/:slug`, destination: "/", permanent: true },
    ]);
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(bundleAnalyzer(withNextIntl(nextConfig)), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  // `SENTRY_ORG` et `SENTRY_PROJECT` étaient déjà validés dans src/lib/env.ts
  // mais jamais lus : les valeurs vivaient en dur ici, ce qui faisait deux
  // sources de vérité pour la même donnée — et l'une des deux a vieilli.
  // Sans ces variables, le plugin n'envoie simplement pas les source maps.
  org: process.env.SENTRY_ORG,

  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
