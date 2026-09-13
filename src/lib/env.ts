import { z } from "zod";

/**
 * Server-side environment schema. Validated at module load.
 * NEVER expose these values to the client bundle.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Resend
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  CONTACT_EMAIL_FROM: z.email(),
  CONTACT_EMAIL_TO: z.email(),

  // Turnstile (server)
  TURNSTILE_SECRET_KEY: z.string().min(1, "TURNSTILE_SECRET_KEY is required"),

  // GitHub (optional — dashboard degrades gracefully if absent)
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_USERNAME: z.string().optional(),

  // Sentry (optional)
  SENTRY_DSN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
});

/**
 * Client-side schema. Anything here is shipped in the JS bundle — keep it minimal.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.url().optional(),
});

const clientValues = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
};

const isServer = typeof window === "undefined";
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";
const skipServerValidation = !isServer || isBuildTime;

const parsedClient = clientSchema.safeParse(clientValues);
if (!parsedClient.success) {
  console.error("❌ Invalid public env vars:", parsedClient.error.flatten().fieldErrors);
  throw new Error("Invalid public environment variables");
}

let parsedServer: z.infer<typeof serverSchema> | undefined;
if (!skipServerValidation) {
  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid server env vars:", result.error.flatten().fieldErrors);
    throw new Error("Invalid server environment variables");
  }
  parsedServer = result.data;
}

/**
 * Use `env` everywhere — server values throw if accessed from the client.
 */
export const env = new Proxy(
  {
    ...parsedClient.data,
    ...(parsedServer ?? {}),
  } as z.infer<typeof clientSchema> & z.infer<typeof serverSchema>,
  {
    get(target, key: string) {
      if (typeof window !== "undefined" && !key.startsWith("NEXT_PUBLIC_")) {
        throw new Error(`❌ Attempted to access server-only env var "${key}" from the client.`);
      }
      return Reflect.get(target, key);
    },
  },
);

export type Env = typeof env;
