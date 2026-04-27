"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import type { ProjectMeta } from "@/lib/content";
import { cn } from "@/lib/utils";

export type ProjectListItem = {
  meta: ProjectMeta;
  title: string;
  summary: string;
};

type Props = {
  items: ProjectListItem[];
};

export function ProjectsGrid({ items }: Props) {
  const t = useTranslations("Projects");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) for (const tag of item.meta.tags) set.add(tag);
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    if (!activeTag) return items;
    return items.filter((it) => it.meta.tags.includes(activeTag));
  }, [items, activeTag]);

  return (
    <div className="space-y-8">
      {tags.length > 0 ? (
        <fieldset>
          <legend className="sr-only">{t("filters.label")}</legend>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("filters.label")}>
            <FilterPill
              active={activeTag === null}
              onClick={() => setActiveTag(null)}
            >
              {t("filters.all")}
            </FilterPill>
            {tags.map((tag) => (
              <FilterPill
                key={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              >
                {tag}
              </FilterPill>
            ))}
          </div>
        </fieldset>
      ) : null}

      {filtered.length === 0 ? (
        <p className="text-foreground/60">{t("empty")}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ProjectCard
              key={item.meta.slug}
              meta={item.meta}
              title={item.title}
              summary={item.summary}
              cta={t("viewProject")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        active
          ? "border-primary/60 bg-primary/15 text-primary"
          : "border-border bg-background/40 text-foreground/70 hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
