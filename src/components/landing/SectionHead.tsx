import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { AppPathnames } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type StaticPathname = Exclude<AppPathnames, `${string}[${string}`>;

type Action =
  | { kind: "link" | "button"; href: StaticPathname; label: string }
  | { kind: "external"; href: string; label: string };

type Props = {
  /** Identifiant du titre, pour l'`aria-labelledby` de la section. */
  id: string;
  kicker: string;
  title: ReactNode;
  aside?: string;
  action?: Action;
  /** Contrôles propres à la section, comme les flèches d'un carrousel. */
  controls?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

/**
 * En-tête de section de la maquette : chemin cuivré au-dessus du titre à
 * gauche ; légende et action alignées à droite, sur la ligne du titre.
 */
export function SectionHead({
  id,
  kicker,
  title,
  aside,
  action,
  controls,
  tone = "light",
  className,
}: Props) {
  const dark = tone === "dark";

  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-x-12 gap-y-4", className)}>
      <div>
        <p
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.22em]",
            dark ? "text-copper-bright" : "text-copper-deep",
          )}
        >
          <span aria-hidden="true">/ </span>
          {kicker}
        </p>
        <h2
          id={id}
          className={cn(
            "mt-2 text-balance text-[clamp(1.7rem,2.3vw,2rem)] font-bold leading-[1.05] tracking-[-0.03em]",
            dark ? "text-screen-ink" : "text-ink",
          )}
        >
          {title}
        </h2>
      </div>

      {aside || action || controls ? (
        <div className="flex flex-wrap items-center gap-x-14 gap-y-3">
          {aside ? (
            <p
              className={cn(
                "max-w-[16.5rem] text-balance text-[13px] leading-snug",
                dark ? "text-screen-soft" : "text-ink-soft",
              )}
            >
              {aside}
            </p>
          ) : null}
          {action ? <SectionAction action={action} dark={dark} /> : null}
          {controls}
        </div>
      ) : null}
    </header>
  );
}

function SectionAction({ action, dark }: { action: Action; dark: boolean }) {
  const arrow = (
    <ArrowRight
      className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
      aria-hidden="true"
    />
  );

  if (action.kind === "link") {
    return (
      <Link
        href={action.href}
        className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-copper-deep transition-colors hover:text-ink"
      >
        {action.label}
        {arrow}
      </Link>
    );
  }

  const button = cn(
    "group inline-flex h-9 items-center gap-2 rounded-lg border px-4 text-[12.5px] font-semibold transition-colors",
    dark
      ? "border-copper-bright/55 text-screen-ink hover:bg-copper-bright/12"
      : "border-rule bg-chalk text-ink shadow-lift-1 hover:border-copper/50",
  );

  if (action.kind === "external") {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" className={button}>
        {action.label}
        {arrow}
      </a>
    );
  }

  return (
    <Link href={action.href} className={button}>
      {action.label}
      {arrow}
    </Link>
  );
}
