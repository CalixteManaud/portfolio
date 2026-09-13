"use client";

import {
  Activity,
  Boxes,
  Cloud,
  Code2,
  Database,
  Infinity as InfinityIcon,
  LayoutGrid,
  ShieldHalf,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type ComponentType, type SVGProps, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type Category, TOOLS } from "./tools";

type Filter = "all" | Category;

const FILTERS: Filter[] = [
  "all",
  "cloud",
  "devops",
  "dev",
  "security",
  "monitoring",
  "data",
  "other",
];

const FILTER_ICONS: Record<Filter, ComponentType<SVGProps<SVGSVGElement>>> = {
  all: LayoutGrid,
  cloud: Cloud,
  devops: InfinityIcon,
  dev: Code2,
  security: ShieldHalf,
  monitoring: Activity,
  data: Database,
  other: Boxes,
};

export function StackExplorer() {
  const t = useTranslations("Skills.stack");
  const [filter, setFilter] = useState<Filter>("all");
  const shown = filter === "all" ? TOOLS : TOOLS.filter((tool) => tool.cats.includes(filter));

  return (
    <>
      <ToggleGroup
        type="single"
        value={filter}
        onValueChange={(value) => {
          // Un groupe « single » renvoie une chaîne vide quand on reclique
          // l'élément actif : on garde alors le filtre courant.
          if (value) setFilter(value as Filter);
        }}
        aria-label={t("filterLabel")}
        className="mt-6 flex w-full flex-wrap justify-start gap-2"
      >
        {FILTERS.map((f) => {
          const Icon = FILTER_ICONS[f];
          return (
            <ToggleGroupItem
              key={f}
              value={f}
              className="h-9 flex-none gap-2 rounded-full border border-screen-rule bg-transparent px-4 text-[12.5px] font-medium text-screen-soft shadow-none first:rounded-full last:rounded-full hover:bg-screen-raised hover:text-screen-ink data-[state=on]:border-copper-bright data-[state=on]:bg-copper-bright data-[state=on]:text-screen"
            >
              <Icon className="size-3.5 max-sm:hidden" aria-hidden="true" />
              {t(`filters.${f}`)}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      <p aria-live="polite" className="sr-only">
        {t("count", { count: shown.length })}
      </p>

      <ul className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-10">
        {shown.map(({ name, Icon, color }) => (
          <li
            key={name}
            className="flex h-[88px] flex-col items-center justify-center gap-2.5 rounded-xl border border-screen-rule bg-screen-raised text-screen-ink transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-copper-bright/50 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-300"
          >
            <Icon className="h-8 w-auto max-w-11" color={color} aria-hidden="true" />
            <span className="text-[12px] font-medium">{name}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
