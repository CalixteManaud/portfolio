import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ProjectMeta } from "@/lib/content";

type Props = {
  meta: ProjectMeta;
  title: string;
  summary: string;
  cta: string;
};

export function ProjectCard({ meta, title, summary, cta }: Props) {
  return (
    <Link
      href={{ pathname: "/projects/[slug]", params: { slug: meta.slug } }}
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-200 hover:border-[oklch(0.70_0.28_240/0.5)] hover:bg-card/70 hover:shadow-[0_0_30px_oklch(0.70_0.28_240/0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.70_0.28_240/0.6)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          {meta.featured ? (
            <span className="inline-flex rounded-full border border-[oklch(0.70_0.28_240/0.4)] bg-[oklch(0.70_0.28_240/0.10)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.70_0.28_240)]">
              Featured
            </span>
          ) : null}
          <h3 className="text-balance text-xl font-bold tracking-tight transition-colors group-hover:text-[oklch(0.70_0.28_240)]">
            {title}
          </h3>
        </div>
        <ArrowUpRight
          className="size-5 shrink-0 text-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[oklch(0.70_0.28_240)]"
          aria-hidden="true"
        />
      </div>

      <p className="text-sm leading-relaxed text-foreground/65 line-clamp-3">
        {summary}
      </p>

      {meta.stack.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {meta.stack.slice(0, 5).map((s) => (
            <span
              key={s}
              className="rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-foreground/65"
            >
              {s}
            </span>
          ))}
          {meta.stack.length > 5 ? (
            <span className="rounded-md px-2 py-0.5 font-mono text-[11px] text-foreground/40">
              +{meta.stack.length - 5}
            </span>
          ) : null}
        </div>
      ) : null}

      <span className="sr-only">{cta}</span>
    </Link>
  );
}
