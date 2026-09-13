import { Play } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Libellé de section de la page À propos : un triangle cuivré devant des
 *  capitales espacées, comme sur la maquette. */
export function Kicker({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.24em]",
        dark ? "text-screen-ink" : "text-ink",
      )}
    >
      <Play
        aria-hidden="true"
        className={cn(
          "size-2.5",
          dark ? "fill-copper-bright text-copper-bright" : "fill-copper text-copper",
        )}
      />
      {children}
    </p>
  );
}
