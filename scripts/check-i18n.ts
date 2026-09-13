/**
 * Verifies that every translation key present in the default locale (fr)
 * also exists in en, es, de — and that no extra/orphan keys exist elsewhere.
 *
 * Run via: pnpm i18n:check
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const MESSAGES_DIR = join(process.cwd(), "messages");
const DEFAULT_LOCALE = "fr";
const REQUIRED_LOCALES = ["fr", "en", "es", "de"] as const;

type JsonObject = { [k: string]: unknown };

function flatten(obj: JsonObject, prefix = ""): string[] {
  const out: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out.push(...flatten(value as JsonObject, path));
    } else {
      out.push(path);
    }
  }
  return out;
}

async function loadLocale(locale: string): Promise<string[]> {
  const raw = await readFile(join(MESSAGES_DIR, `${locale}.json`), "utf-8");
  return flatten(JSON.parse(raw)).sort();
}

async function main() {
  const files = await readdir(MESSAGES_DIR);
  const presentLocales = files
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));

  const missingFiles = REQUIRED_LOCALES.filter((l) => !presentLocales.includes(l));
  if (missingFiles.length) {
    console.error(`❌ Missing locale files: ${missingFiles.join(", ")}`);
    process.exit(1);
  }

  const reference = await loadLocale(DEFAULT_LOCALE);
  let hasError = false;

  for (const locale of REQUIRED_LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    const keys = await loadLocale(locale);

    const missing = reference.filter((k) => !keys.includes(k));
    const extra = keys.filter((k) => !reference.includes(k));

    if (missing.length) {
      hasError = true;
      console.error(`\n❌ [${locale}] Missing ${missing.length} key(s):`);
      for (const k of missing) console.error(`   - ${k}`);
    }
    if (extra.length) {
      hasError = true;
      console.error(`\n❌ [${locale}] Extra ${extra.length} key(s) not in ${DEFAULT_LOCALE}:`);
      for (const k of extra) console.error(`   + ${k}`);
    }
    if (!missing.length && !extra.length) {
      console.log(`✅ [${locale}] ${keys.length} keys — parity OK`);
    }
  }

  if (hasError) process.exit(1);
  console.log(`\n✨ All ${REQUIRED_LOCALES.length} locales in sync (${reference.length} keys).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
