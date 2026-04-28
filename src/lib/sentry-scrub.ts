import type { ErrorEvent, EventHint } from "@sentry/nextjs";

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const IPV4_RE = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
const IPV6_RE = /\b(?:[A-Fa-f0-9]{1,4}:){2,7}[A-Fa-f0-9]{1,4}\b/g;
const BEARER_RE = /Bearer\s+[A-Za-z0-9._\-+/=]+/gi;

const SENSITIVE_HEADERS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "x-auth-token",
  "x-forwarded-for",
  "x-real-ip",
]);

function scrubString(value: unknown): unknown {
  if (typeof value !== "string") return value;
  return value
    .replace(EMAIL_RE, "[email-redacted]")
    .replace(BEARER_RE, "Bearer [token-redacted]")
    .replace(IPV4_RE, "[ip-redacted]")
    .replace(IPV6_RE, "[ip-redacted]");
}

function scrubObject<T extends object>(obj: T): T {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      (obj as Record<string, unknown>)[key] = scrubString(value);
    } else if (value && typeof value === "object") {
      scrubObject(value as object);
    }
  }
  return obj;
}

/**
 * Sentry beforeSend hook — strips PII (emails, IPs, bearer tokens, sensitive headers)
 * from breadcrumbs, request payloads, exception messages, and user context.
 */
export function scrubEvent(event: ErrorEvent, _hint: EventHint): ErrorEvent | null {
  // Drop the user object — we don't capture identifiable users on this site.
  event.user = undefined;

  if (event.request) {
    if (event.request.headers) {
      for (const key of Object.keys(event.request.headers)) {
        if (SENSITIVE_HEADERS.has(key.toLowerCase())) {
          event.request.headers[key] = "[redacted]";
        }
      }
    }
    if (event.request.cookies) delete event.request.cookies;
    if (event.request.data) {
      event.request.data =
        typeof event.request.data === "string"
          ? scrubString(event.request.data)
          : scrubObject({ ...(event.request.data as object) });
    }
    if (event.request.query_string) {
      event.request.query_string = scrubString(
        event.request.query_string as string,
      ) as typeof event.request.query_string;
    }
  }

  if (event.exception?.values) {
    for (const ex of event.exception.values) {
      if (ex.value) ex.value = scrubString(ex.value) as string;
    }
  }

  if (event.message) {
    event.message =
      typeof event.message === "string" ? (scrubString(event.message) as string) : event.message;
  }

  if (event.breadcrumbs) {
    for (const crumb of event.breadcrumbs) {
      if (crumb.message) crumb.message = scrubString(crumb.message) as string;
      if (crumb.data) scrubObject(crumb.data);
    }
  }

  return event;
}
