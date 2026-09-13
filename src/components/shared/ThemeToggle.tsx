"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/**
 * Bascule clair / sombre.
 *
 * L'état initial n'est pas lu au montage mais au premier effet : le serveur
 * ignore la préférence du visiteur, donc rendre une icône avant l'hydratation
 * afficherait la mauvaise la moitié du temps. Le bouton garde sa place dans la
 * mise en page dès le premier paint — c'est son contenu qui attend, pas sa
 * boîte, sinon la barre sauterait à l'hydratation.
 */
export function ThemeToggle() {
  const t = useTranslations("Theme");
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Navigation privée ou stockage refusé : le thème tient pour la session.
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark === true}
      aria-label={dark ? t("toLight") : t("toDark")}
      title={dark ? t("toLight") : t("toDark")}
      className="inline-flex size-9 items-center justify-center rounded-lg border border-rule bg-chalk text-ink-soft shadow-lift-1 transition-colors hover:text-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/60"
    >
      {dark === null ? (
        <span className="size-4" aria-hidden="true" />
      ) : dark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
