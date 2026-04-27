import { AlertTriangle, CheckCircle2, Info, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "info" | "warn" | "success" | "tip";

const variants: Record<
  Variant,
  { icon: typeof Info; classes: string }
> = {
  info: {
    icon: Info,
    classes: "border-sky-500/40 bg-sky-500/10 text-sky-100",
  },
  warn: {
    icon: AlertTriangle,
    classes: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  },
  success: {
    icon: CheckCircle2,
    classes: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  },
  tip: {
    icon: Lightbulb,
    classes: "border-violet-500/40 bg-violet-500/10 text-violet-100",
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
    <aside
      className={cn(
        "my-6 flex gap-3 rounded-lg border px-4 py-3 text-sm",
        classes,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="text-foreground/90">{children}</div>
      </div>
    </aside>
  );
}
