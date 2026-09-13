import { ArrowRight } from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { Link } from "@/i18n/navigation";
import type { AppPathnames } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Routes déclarées sans segment dynamique — les seules linkables sans params. */
type StaticPathname = Exclude<AppPathnames, `${string}[${string}`>;

export type EmptyStateAction =
  | { kind: "internal"; href: StaticPathname; label: string; icon?: IconComponent }
  | { kind: "external"; href: string; label: string; icon?: IconComponent }
  | { kind: "button"; onClick: () => void; label: string; icon?: IconComponent };

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type Props = {
  /** Relevé d'état, en mono dans la barre de titre : « aucune entrée publiée ». */
  status: string;
  title: string;
  /** Ce qui apparaîtra ici, et pourquoi. Deux phrases au maximum. */
  body: ReactNode;
  /** Les sorties. Un cul-de-sac est le seul vrai défaut d'un état vide. */
  actions?: EmptyStateAction[];
  className?: string;
};

/**
 * État vide, en relevé d'état plutôt qu'en page d'erreur.
 *
 * Le portfolio a une particularité qui change tout par rapport à un état vide
 * de SaaS : **le visiteur n'est pas l'auteur**. « Créez votre première entrée »
 * n'a aucun sens pour un recruteur — il ne peut rien créer. La seule chose utile
 * qu'on puisse lui offrir est une redirection vers ce qui existe déjà.
 *
 * La pastille est volontairement neutre, ni verte ni rouge : dans un poste de
 * supervision, un service sans données n'est pas en panne, il est au repos.
 */
export function EmptyState({ status, title, body, actions = [], className }: Props) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-sm",
        className,
      )}
    >
      <p className="flex items-center gap-2 border-b border-border/60 px-5 py-3 font-mono text-[11px] tracking-[0.06em] text-foreground/60">
        <span className="size-1.5 rounded-full bg-foreground/40" aria-hidden="true" />
        {status}
      </p>

      <div className="space-y-4 p-6">
        <h2 className="text-balance text-xl font-semibold tracking-tight">{title}</h2>
        <p className="max-w-prose text-pretty leading-relaxed text-foreground/70">{body}</p>

        {actions.length > 0 ? (
          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
            {actions.map((action) => (
              <li key={action.label}>
                <ActionLink action={action} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

const ACTION_CLASS =
  "group inline-flex items-center gap-1.5 rounded-md text-sm text-foreground/80 transition-colors hover:text-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/60";

function ActionLink({ action }: { action: EmptyStateAction }) {
  const Icon = action.icon;
  const inner = (
    <>
      {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
      {action.label}
      <ArrowRight
        className="size-4 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </>
  );

  if (action.kind === "button") {
    return (
      <button type="button" onClick={action.onClick} className={ACTION_CLASS}>
        {inner}
      </button>
    );
  }

  if (action.kind === "external") {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" className={ACTION_CLASS}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={action.href} className={ACTION_CLASS}>
      {inner}
    </Link>
  );
}
