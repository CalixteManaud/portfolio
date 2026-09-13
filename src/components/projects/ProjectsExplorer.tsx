"use client";

import {
  SiDocker,
  SiGithub,
  SiGitlab,
  SiKubernetes,
  SiLinux,
  SiMdx,
  SiNextdotjs,
  SiResend,
  SiSentry,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiTerraform,
  SiThreedotjs,
  SiTrivy,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import {
  ArrowRight,
  Cloud,
  Cog,
  FileText,
  LayoutGrid,
  Monitor,
  Search,
  Shield,
  Workflow,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type ComponentType, type SVGProps, useMemo, useState } from "react";
import { EmptyState } from "@/components/sections/EmptyState";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ProjectVisual } from "./ProjectVisual";
import type { ProjectCategory, ProjectItem } from "./types";

type Filter = "all" | ProjectCategory;
type IconType = ComponentType<SVGProps<SVGSVGElement> & { color?: string }>;

const FILTERS: Array<{ id: Filter; Icon?: ComponentType<SVGProps<SVGSVGElement>> }> = [
  { id: "all" },
  { id: "devops", Icon: Cog },
  { id: "web", Icon: Monitor },
  { id: "cloud", Icon: Cloud },
  { id: "security", Icon: Shield },
  { id: "automation", Icon: Workflow },
  { id: "apps", Icon: LayoutGrid },
];

/**
 * Les marques de la stack, quand simple-icons en a une ; les autres étiquettes
 * restent en texte seul, comme sur la maquette. Les marques noires ou bleu
 * nuit prennent la couleur du texte pour rester visibles en thème sombre.
 */
const STACK_ICONS: Record<string, { Icon: IconType; color?: string }> = {
  "Next.js": { Icon: SiNextdotjs },
  TypeScript: { Icon: SiTypescript, color: "default" },
  Supabase: { Icon: SiSupabase, color: "default" },
  Terraform: { Icon: SiTerraform, color: "default" },
  Kubernetes: { Icon: SiKubernetes, color: "default" },
  Linux: { Icon: SiLinux },
  "GitLab CI": { Icon: SiGitlab, color: "default" },
  Trivy: { Icon: SiTrivy },
  "Docker Scout": { Icon: SiDocker, color: "default" },
  Docker: { Icon: SiDocker, color: "default" },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "default" },
  "React Three Fiber": { Icon: SiThreedotjs },
  "shadcn/ui": { Icon: SiShadcnui },
  MDX: { Icon: SiMdx },
  Resend: { Icon: SiResend },
  Sentry: { Icon: SiSentry },
};

export function ProjectsExplorer({ items }: { items: ProjectItem[] }) {
  const t = useTranslations("Projects");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== "all" && !item.categories.includes(filter)) return false;
      if (!q) return true;
      return [item.title, item.summary, ...item.stack].join(" ").toLowerCase().includes(q);
    });
  }, [items, filter, query]);
  const n = shown.length;

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Sous lg, une seule rangée qui défile plutôt que quatre rangées de pastilles. */}
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(value) => {
            if (value) setFilter(value as Filter);
          }}
          aria-label={t("toolbar.filterLabel")}
          className="flex w-full snap-x flex-nowrap justify-start gap-2 overflow-x-auto py-1 pr-10 [mask-image:linear-gradient(to_right,black_82%,transparent)] [scrollbar-width:none] lg:w-auto lg:flex-wrap lg:overflow-visible lg:pr-0 lg:[mask-image:none]"
        >
          {FILTERS.map(({ id, Icon }) => (
            <ToggleGroupItem
              key={id}
              value={id}
              className="h-9 flex-none shrink-0 snap-start gap-2 rounded-full border border-rule bg-chalk px-4 text-[12.5px] font-medium text-ink shadow-none first:rounded-full last:rounded-full hover:border-copper/50 hover:bg-chalk data-[state=on]:border-ink data-[state=on]:bg-ink data-[state=on]:text-board"
            >
              {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
              {t(`toolbar.filters.${id}`)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <label className="relative flex h-10 w-full shrink-0 items-center lg:w-[270px]">
          <span className="sr-only">{t("toolbar.searchLabel")}</span>
          <Search
            className="pointer-events-none absolute left-3.5 size-4 text-ink-soft"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("toolbar.search")}
            className="h-full w-full rounded-full border border-rule bg-chalk pr-4 pl-10 text-[13px] text-ink shadow-lift-1 outline-none placeholder:text-ink-soft focus-visible:border-copper/60 focus-visible:ring-2 focus-visible:ring-copper/30"
          />
        </label>
      </div>

      <p aria-live="polite" className="sr-only">
        {t("toolbar.count", { count: n })}
      </p>

      {n === 0 ? (
        <div className="mt-6">
          <EmptyState
            status={t("noResult.status")}
            title={t("noResult.title")}
            body={t("noResult.body")}
            actions={[
              {
                kind: "button",
                onClick: () => {
                  setFilter("all");
                  setQuery("");
                },
                label: t("noResult.reset"),
              },
            ]}
          />
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {shown.map((item, i) => {
            // Jamais de carte orpheline : une dernière carte seule occupe toute
            // la ligne en format horizontal, deux cartes restantes se la partagent.
            const wideSm = n % 2 === 1 && i === n - 1;
            const wideLg = n % 3 === 1 && i === n - 1;
            const halfLg = n % 3 === 2 && i >= n - 2;
            return (
              <li
                key={item.slug}
                className={cn(
                  "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-[0.98] motion-safe:duration-300",
                  wideSm && "sm:col-span-2",
                  wideLg ? "lg:col-span-6" : halfLg ? "lg:col-span-3" : "lg:col-span-2",
                )}
              >
                <ProjectCard item={item} wideSm={wideSm} wideLg={wideLg} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function ProjectCard({
  item,
  wideSm,
  wideLg,
}: {
  item: ProjectItem;
  wideSm: boolean;
  wideLg: boolean;
}) {
  const t = useTranslations("Projects");
  const secondary = item.links.repo
    ? { href: item.links.repo, label: t("links.repo"), Icon: SiGithub }
    : item.links.docs
      ? { href: item.links.docs, label: t("links.docs"), Icon: FileText }
      : null;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-chalk shadow-lift-1 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift-2",
        wideSm && "sm:flex-row",
        wideLg ? "lg:flex-row" : wideSm && "lg:flex-col",
      )}
    >
      <div
        className={cn(
          "relative",
          wideSm && "sm:w-[46%] sm:shrink-0",
          wideLg ? "lg:w-[44%] lg:shrink-0" : wideSm && "lg:w-auto",
        )}
      >
        <ProjectVisual
          image={item.image}
          kind={item.kind}
          alt={item.title}
          pendingLabel={t("imagePending")}
          sizes={
            wideSm || wideLg
              ? "(max-width: 640px) 100vw, 580px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          }
          className={cn(
            "aspect-[2.45/1]",
            wideSm && "sm:aspect-auto sm:h-full sm:min-h-[240px]",
            wideLg
              ? "lg:aspect-auto lg:h-full lg:min-h-[240px]"
              : wideSm && "lg:aspect-[2.45/1] lg:h-auto lg:min-h-0",
          )}
        />
        {item.kind ? (
          <span className="absolute top-3 right-3 rounded-full bg-screen/80 px-3 py-1 text-[11.5px] font-medium text-screen-ink ring-1 ring-white/15 backdrop-blur-sm">
            {t(`kinds.${item.kind}`)}
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col p-5",
          wideSm && "sm:p-7",
          wideLg ? "lg:justify-center lg:p-8" : wideSm && "lg:p-5",
        )}
      >
        <h3 className="text-[16.5px] font-semibold leading-snug tracking-[-0.01em] text-ink">
          {item.title}
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{item.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {item.stack.slice(0, 4).map((tech) => {
            const mark = STACK_ICONS[tech];
            return (
              <li
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-md border border-rule px-2.5 py-1 text-[11.5px] text-ink-soft"
              >
                {mark ? (
                  <mark.Icon className="size-3 shrink-0" color={mark.color} aria-hidden="true" />
                ) : null}
                {tech}
              </li>
            );
          })}
        </ul>
        <div
          className={cn(
            "mt-auto flex items-center justify-between gap-3 pt-5 text-[13px]",
            wideLg && "lg:mt-6 lg:justify-start lg:gap-6",
          )}
        >
          <Link
            href={{ pathname: "/projects/[slug]", params: { slug: item.slug } }}
            className="group/link inline-flex items-center gap-1.5 font-semibold text-ink transition-colors hover:text-copper-deep"
          >
            {t("viewProject")}
            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          {secondary ? (
            <a
              href={secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-ink-soft transition-colors hover:text-ink"
            >
              <secondary.Icon className="size-3.5" aria-hidden="true" />
              {secondary.label}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
