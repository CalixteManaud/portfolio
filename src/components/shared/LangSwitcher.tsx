"use client";

import { Check, Globe } from "lucide-react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { type Locale, localeFlags, localeNames, locales } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LangSwitcher() {
  const t = useTranslations("LangSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (next: Locale) => {
    setOpen(false);
    if (next === currentLocale) return;
    // Preserve the current pathname (already locale-stripped by next-intl) + params.
    router.replace(
      // biome-ignore lint/suspicious/noExplicitAny: pathname<>params typing is too narrow for the dynamic case
      { pathname, params: params as any },
      { locale: next },
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open ? "true" : "false"}
        aria-label={t("label")}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-sm font-medium text-foreground/85 backdrop-blur-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Globe className="size-4" aria-hidden="true" />
        <span aria-hidden="true">{localeFlags[currentLocale]}</span>
        <span className="uppercase">{currentLocale}</span>
      </button>

      {open ? (
        <ul
          aria-label={t("label")}
          className="absolute right-0 top-full z-50 mt-2 min-w-45 overflow-hidden rounded-lg border border-border bg-popover/95 py-1 shadow-xl backdrop-blur-md"
        >
          {locales.map((loc) => {
            const active = loc === currentLocale;
            return (
              <li key={loc}>
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => switchTo(loc)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3 py-2 text-sm text-foreground/85 transition-colors hover:bg-muted",
                    active && "text-foreground",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true">{localeFlags[loc]}</span>
                    <span>{localeNames[loc]}</span>
                  </span>
                  {active ? <Check className="size-4 text-primary" aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
