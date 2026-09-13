import "server-only";

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { cache } from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { mdxComponents } from "@/components/mdx";
import { defaultLocale, type Locale, locales } from "@/i18n/config";

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
  /** Nature du projet, affichée en pastille sur sa carte. */
  kind: z.enum(["application", "infrastructure", "cicd", "web", "enterprise"]).optional(),
  /** Catégories des filtres de la page Projets. */
  categories: z
    .array(z.enum(["devops", "web", "cloud", "security", "automation", "apps"]))
    .default([]),
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
  /** Certifications obtenues pendant cette étape. */
  certifications: z.array(z.string()).default([]),
});

/** Pages éditoriales autonomes (mentions légales, confidentialité) : pas de
 *  métadonnée propre au-delà de la base, le titre vient du MDX lui-même. */
export const pageMetaSchema = baseMeta.extend({
  updatedAt: z.string(),
});

export type ProjectMeta = z.infer<typeof projectMetaSchema>;
export type MeetingMeta = z.infer<typeof meetingMetaSchema>;
export type CareerMeta = z.infer<typeof careerMetaSchema>;
export type PageMeta = z.infer<typeof pageMetaSchema>;

// ─── Generic loader ──────────────────────────────────────────────────────────

type ContentKind = "projects" | "career" | "pages";

const schemaByKind = {
  projects: projectMetaSchema,
  career: careerMetaSchema,
  pages: pageMetaSchema,
} as const;

type MetaByKind = {
  projects: ProjectMeta;
  career: CareerMeta;
  pages: PageMeta;
};

export type ContentEntry<K extends ContentKind> = {
  meta: MetaByKind[K];
  locale: Locale;
  isFallback: boolean;
  content: React.ReactElement;
  raw: string;
  frontmatter: Record<string, unknown>;
  /** Les titres de niveau 2, dans l'ordre, avec l'ancre de leur section
   *  (`s-01`, `s-02`…). Seules les pages éditoriales posent ces ancres. */
  headings: { id: string; text: string }[];
};

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const sectionId = (index: number) => `s-${String(index + 1).padStart(2, "0")}`;

/**
 * Regroupe chaque titre de niveau 2 et ce qui le suit dans une `<section>`
 * numérotée. Les pages éditoriales (mentions, confidentialité) en font des
 * cartes, et leur sommaire pointe vers ces ancres.
 */
function rehypeSections() {
  return (tree: HastNode) => {
    const out: HastNode[] = [];
    let current: HastNode | null = null;
    let count = 0;
    for (const node of tree.children ?? []) {
      if (node.type === "element" && node.tagName === "h2") {
        const id = sectionId(count);
        count += 1;
        current = {
          type: "element",
          tagName: "section",
          properties: { id, dataSection: id.slice(2) },
          children: [node],
        };
        out.push(current);
      } else if (current) {
        current.children?.push(node);
      } else {
        out.push(node);
      }
    }
    tree.children = out;
  };
}

/** Les mêmes titres, lus dans la source : ils alimentent le sommaire. */
function sectionHeadings(source: string): { id: string; text: string }[] {
  return [...source.matchAll(/^## (.+)$/gm)].map((match, i) => ({
    id: sectionId(i),
    text: (match[1] ?? "").trim(),
  }));
}

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
  async <K extends ContentKind>(kind: K, slug: string): Promise<MetaByKind[K] | null> => {
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
            ...(kind === "pages" ? [rehypeSections] : []),
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
      headings: kind === "pages" ? sectionHeadings(source) : [],
    };
  },
);

export const listEntries = cache(
  async <K extends ContentKind>(kind: K, locale: Locale): Promise<ContentEntry<K>[]> => {
    const slugs = await listSlugs(kind);
    const entries = await Promise.all(slugs.map((slug) => getEntry(kind, slug, locale)));
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
  return slugs.flatMap((slug) => locales.map((locale) => ({ locale, slug })));
}
