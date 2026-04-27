// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { scrubEvent } from "@/lib/sentry-scrub";

Sentry.init({
  dsn: "https://e39a8dd07a11942c57a11c499ad6b43a@o4511259206549504.ingest.de.sentry.io/4511259260944464",

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
  enableLogs: true,

  // PII filtering: never send identifiable user info, scrub PII from payloads.
  sendDefaultPii: false,
  beforeSend: scrubEvent,
});
