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
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          {meta.featured ? (
            <span className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              Featured
            </span>
          ) : null}
          <h3 className="text-balance text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
            {title}
          </h3>
        </div>
        <ArrowUpRight
          className="size-5 shrink-0 text-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
          aria-hidden="true"
        />
      </div>

      <p className="text-sm leading-relaxed text-foreground/70 line-clamp-3">
        {summary}
      </p>

      {meta.stack.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {meta.stack.slice(0, 5).map((s) => (
            <span
              key={s}
              className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[11px] text-foreground/70"
            >
              {s}
            </span>
          ))}
          {meta.stack.length > 5 ? (
            <span className="rounded-md px-2 py-0.5 font-mono text-[11px] text-foreground/50">
              +{meta.stack.length - 5}
            </span>
          ) : null}
        </div>
      ) : null}

      <span className="sr-only">{cta}</span>
    </Link>
  );
}
