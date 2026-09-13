"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Copie une coordonnée dans le presse-papiers, et l'annonce. */
export function CopyButton({
  value,
  label,
  copiedLabel,
  tone = "light",
}: {
  value: string;
  label: string;
  copiedLabel: string;
  /** `dark` sur les cartes sombres (#1E2023). */
  tone?: "light" | "dark";
}) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      window.setTimeout(() => setDone(false), 1800);
    } catch {
      // Presse-papiers refusé (contexte non sécurisé, permission) : la valeur
      // reste lisible et sélectionnable à côté du bouton.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className={
        tone === "dark"
          ? "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-screen-soft transition-colors hover:bg-screen hover:text-screen-ink"
          : "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-board-sunk hover:text-ink"
      }
    >
      {done ? (
        <Check
          className={tone === "dark" ? "size-4 text-go-bright" : "size-4 text-go"}
          aria-hidden="true"
        />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {done ? copiedLabel : ""}
      </span>
    </button>
  );
}
