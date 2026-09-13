import { AlertTriangle, CheckCircle2, Info, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "info" | "warn" | "success" | "tip";

/** Chaque variante tire ses couleurs des tokens du design system, jamais de la
 *  palette Tailwind par défaut : `warn` reprend l'ambre signal, qui est
 *  précisément la couleur d'avertissement dont l'identité du site est tirée. */
const variants: Record<Variant, { icon: typeof Info; classes: string }> = {
  info: {
    icon: Info,
    classes: "border-steel/40 bg-steel/10",
  },
  warn: {
    icon: AlertTriangle,
    classes: "border-copper/40 bg-copper/10",
  },
  success: {
    icon: CheckCircle2,
    classes: "border-go/40 bg-go/10",
  },
  tip: {
    icon: Lightbulb,
    classes: "border-depth/50 bg-depth/10",
  },
};

type Props = {
  variant?: Variant;
  title?: string;
  children: ReactNode;
};

export function Callout({ variant = "info", title, children }: Props) {
  const { icon: Icon, classes } = variants[variant];
  return (
    <aside className={cn("my-6 flex gap-3 rounded-lg border px-4 py-3 text-sm", classes)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="text-foreground/90">{children}</div>
      </div>
    </aside>
  );
}
