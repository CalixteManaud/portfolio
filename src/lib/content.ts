import "server-only";

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { z } from "zod";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defaultLocale, type Locale, locales } from "@/i18n/config";
import { mdxComponents } from "@/components/mdx";

const CONTENT_ROOT = path.join(process.cwd(), "content");

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const baseMeta = z.object({
  slug: z.string().min(1),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  cover: z.string().optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const projectMetaSchema = baseMeta.extend({
  stack: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  links: z
    .object({
      repo: z.url().optional(),
      live: z.url().optional(),
      docs: z.url().optional(),
    })
    .default({}),
});

export const meetingMetaSchema = baseMeta.extend({
  person: z.string().min(1),
  role: z.string().optional(),
  context: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const careerMetaSchema = baseMeta.extend({
  role: z.string().min(1),
  company: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  stack: z.array(z.string()).default([]),
});

export type ProjectMeta = z.infer<typeof projectMetaSchema>;
export type MeetingMeta = z.infer<typeof meetingMetaSchema>;
export type CareerMeta = z.infer<typeof careerMetaSchema>;

// ─── Generic loader ──────────────────────────────────────────────────────────

type ContentKind = "projects" | "meetings" | "career";

const schemaByKind = {
  projects: projectMetaSchema,
  meetings: meetingMetaSchema,
  career: careerMetaSchema,
} as const;

type MetaByKind = {
  projects: ProjectMeta;
  meetings: MeetingMeta;
  career: CareerMeta;
};

export type ContentEntry<K extends ContentKind> = {
  meta: MetaByKind[K];
  locale: Locale;
  isFallback: boolean;
  content: React.ReactElement;
  raw: string;
  frontmatter: Record<string, unknown>;
};

async function dirExists(p: string): Promise<boolean> {
  try {
    const s = await stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
}

const rehypePrettyCodeOptions = {
  theme: { dark: "github-dark", light: "github-light" },
  keepBackground: false,
} as const;

// ─── Public API ──────────────────────────────────────────────────────────────

export const listSlugs = cache(async (kind: ContentKind): Promise<string[]> => {
  const root = path.join(CONTENT_ROOT, kind);
  if (!(await dirExists(root))) return [];
  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
    .map((e) => e.name)
    .sort();
});

export const getMeta = cache(
  async <K extends ContentKind>(
    kind: K,
    slug: string,
  ): Promise<MetaByKind[K] | null> => {
    const metaPath = path.join(CONTENT_ROOT, kind, slug, "meta.json");
    if (!(await fileExists(metaPath))) return null;
    try {
      const raw = await readFile(metaPath, "utf8");
      const parsed = JSON.parse(raw);
      const withSlug = { slug, ...parsed };
      const schema = schemaByKind[kind];
      return schema.parse(withSlug) as MetaByKind[K];
    } catch (err) {
      console.error(`[content] Invalid meta.json for ${kind}/${slug}:`, err);
      return null;
    }
  },
);

export const getEntry = cache(
  async <K extends ContentKind>(
    kind: K,
    slug: string,
    locale: Locale,
  ): Promise<ContentEntry<K> | null> => {
    const meta = await getMeta(kind, slug);
    if (!meta) return null;

    const candidates: Locale[] = [locale];
    if (locale !== defaultLocale) candidates.push(defaultLocale);

    let resolved: { locale: Locale; raw: string } | null = null;
    for (const loc of candidates) {
      const filePath = path.join(CONTENT_ROOT, kind, slug, `${loc}.mdx`);
      if (await fileExists(filePath)) {
        resolved = { locale: loc, raw: await readFile(filePath, "utf8") };
        break;
      }
    }
    if (!resolved) return null;

    const { content: source, data: frontmatter } = matter(resolved.raw);
    const { content } = await compileMDX({
      source,
      components: mdxComponents,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, rehypePrettyCodeOptions],
            [
              rehypeAutolinkHeadings,
              { behavior: "wrap", properties: { className: ["heading-anchor"] } },
            ],
          ],
        },
      },
    });

    return {
      meta,
      locale: resolved.locale,
      isFallback: resolved.locale !== locale,
      content,
      raw: source,
      frontmatter,
    };
  },
);

export const listEntries = cache(
  async <K extends ContentKind>(
    kind: K,
    locale: Locale,
  ): Promise<ContentEntry<K>[]> => {
    const slugs = await listSlugs(kind);
    const entries = await Promise.all(
      slugs.map((slug) => getEntry(kind, slug, locale)),
    );
    return entries
      .filter((e): e is ContentEntry<K> => e !== null)
      .sort((a, b) => {
        if (a.meta.featured !== b.meta.featured) {
          return a.meta.featured ? -1 : 1;
        }
        return a.meta.order - b.meta.order;
      });
  },
);

export async function listAllSlugsForStaticParams(
  kind: ContentKind,
): Promise<{ locale: Locale; slug: string }[]> {
  const slugs = await listSlugs(kind);
  return slugs.flatMap((slug) =>
    locales.map((locale) => ({ locale, slug })),
  );
}
