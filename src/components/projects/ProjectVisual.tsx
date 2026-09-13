import { AppWindow, Building2, Globe, Network, Workflow } from "lucide-react";
import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";
import type { ProjectKind } from "./types";

export const KIND_ICONS: Record<ProjectKind, ComponentType<SVGProps<SVGSVGElement>>> = {
  application: AppWindow,
  infrastructure: Network,
  cicd: Workflow,
  web: Globe,
  enterprise: Building2,
};

/**
 * La capture d'un projet, ou sa réserve tant qu'elle n'est pas déposée.
 * La réserve dit ce qu'elle est (« Capture à venir ») au lieu d'imiter une
 * interface : une fausse capture serait une fiction de plus.
 */
export function ProjectVisual({
  image,
  kind,
  alt,
  pendingLabel,
  sizes,
  className,
  fit = "cover",
}: {
  image: string | null;
  kind?: ProjectKind;
  alt: string;
  pendingLabel: string;
  sizes: string;
  className?: string;
  /** `contain` pour une mise en scène détourée (fond transparent). */
  fit?: "cover" | "contain";
}) {
  const Icon = KIND_ICONS[kind ?? "web"];
  return (
    <div className={cn("relative overflow-hidden bg-screen", className)}>
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className={cn(
            "transition-transform duration-700 ease-out group-hover:scale-[1.03]",
            fit === "cover" ? "object-cover object-top" : "object-contain",
          )}
        />
      ) : (
        <div className="dot-grid-screen absolute inset-0 flex flex-col items-center justify-center gap-2 text-screen-soft">
          <Icon className="size-9 text-copper-bright/70" strokeWidth={1.4} aria-hidden="true" />
          <span className="text-[11.5px] tracking-wide">{pendingLabel}</span>
        </div>
      )}
    </div>
  );
}
