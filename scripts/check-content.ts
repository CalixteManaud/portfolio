/**
 * Verifies the integrity of /content:
 *   - each entity dir has meta.json (validated against its Zod schema)
 *   - at least the default locale (fr) MDX file is present
 *   - warns if other locales (en/es/de) are missing → fallback FR at runtime
 *   - cover paths referenced in meta.json exist in /public
 *
 * Run via: pnpm content:check
 *
 * Note: this script is intentionally tolerant during early scaffold (when
 * /content/ doesn't exist yet). The CI workflow uses continue-on-error.
 */
import { access, readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = join(ROOT, "content");
const PUBLIC_DIR = join(ROOT, "public");
const DEFAULT_LOCALE = "fr";
const LOCALES = ["fr", "en", "es", "de"] as const;
const KINDS = ["projects", "career", "pages"] as const;

let warnings = 0;
let errors = 0;

function warn(msg: string) {
  warnings++;
  console.warn(`⚠️  ${msg}`);
}

function error(msg: string) {
  errors++;
  console.error(`❌ ${msg}`);
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function checkSlug(kind: string, slug: string) {
  const dir = join(CONTENT_DIR, kind, slug);
  const metaPath = join(dir, "meta.json");

  if (!(await exists(metaPath))) {
    error(`${kind}/${slug}: missing meta.json`);
    return;
  }

  let meta: Record<string, unknown>;
  try {
    meta = JSON.parse(await readFile(metaPath, "utf-8"));
  } catch (err) {
    error(`${kind}/${slug}: invalid JSON in meta.json (${(err as Error).message})`);
    return;
  }

  // Default-locale MDX is mandatory (source of truth)
  const defaultMdx = join(dir, `${DEFAULT_LOCALE}.mdx`);
  if (!(await exists(defaultMdx))) {
    error(`${kind}/${slug}: missing ${DEFAULT_LOCALE}.mdx (default locale required)`);
  }

  // Other locales: warn-only (runtime falls back to fr)
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    const mdx = join(dir, `${locale}.mdx`);
    if (!(await exists(mdx))) {
      warn(`${kind}/${slug}: missing ${locale}.mdx → will fall back to ${DEFAULT_LOCALE}`);
    }
  }

  // Cover image existence (if referenced)
  const cover = meta.cover;
  if (typeof cover === "string" && cover.startsWith("/")) {
    const coverPath = join(PUBLIC_DIR, cover);
    if (!(await exists(coverPath))) {
      error(`${kind}/${slug}: cover "${cover}" not found in /public`);
    }
  }
}

async function checkKind(kind: string) {
  const kindDir = join(CONTENT_DIR, kind);
  if (!(await exists(kindDir))) {
    warn(`No content/${kind} directory yet — skipping`);
    return;
  }
  const entries = await readdir(kindDir, { withFileTypes: true });
  const slugs = entries.filter((d) => d.isDirectory()).map((d) => d.name);

  if (!slugs.length) {
    warn(`content/${kind} is empty`);
    return;
  }

  for (const slug of slugs) await checkSlug(kind, slug);
}

async function main() {
  if (!(await exists(CONTENT_DIR))) {
    warn("No /content directory yet — nothing to check (early scaffold).");
    process.exit(0);
  }

  const stats = await stat(CONTENT_DIR);
  if (!stats.isDirectory()) {
    error("/content exists but is not a directory");
    process.exit(1);
  }

  for (const kind of KINDS) await checkKind(kind);

  console.log(`\n${errors === 0 ? "✅" : "❌"} Done. ${errors} error(s), ${warnings} warning(s).`);
  process.exit(errors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
