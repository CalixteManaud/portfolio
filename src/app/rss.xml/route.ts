import { defaultLocale } from "@/i18n/config";
import { listEntries } from "@/lib/content";
import { env } from "@/lib/env";

const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/** Le flux est servi dans la locale par défaut : un lecteur RSS n'a pas de
 *  négociation de langue fiable, et dupliquer le flux ×4 diluerait les lecteurs. */
const FEED_LOCALE = defaultLocale;

const PATHS = { projects: "/projets" } as const;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type FeedItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function GET(): Promise<Response> {
  const projects = await listEntries("projects", FEED_LOCALE);

  const items: FeedItem[] = [
    ...projects.map((entry) => ({
      title: String(entry.frontmatter.title ?? entry.meta.slug),
      link: `${baseUrl}${PATHS.projects}/${entry.meta.slug}`,
      description: String(entry.frontmatter.summary ?? ""),
      pubDate: entry.meta.publishedAt ?? entry.meta.updatedAt ?? "",
    })),
  ]
    .filter((item) => item.pubDate !== "")
    .sort((a, b) => b.pubDate.localeCompare(a.pubDate));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Manaud Calixte — DevOps &amp; DevSecOps</title>
    <link>${baseUrl}</link>
    <description>Projets et parcours.</description>
    <language>${FEED_LOCALE}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
