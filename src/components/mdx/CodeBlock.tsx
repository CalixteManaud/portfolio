import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </pre>
  );
}
