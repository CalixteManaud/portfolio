"use client";

import { Check, Globe } from "lucide-react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Locale, localeFlags, localeNames, locales } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LangSwitcher() {
  const t = useTranslations("LangSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale() as Locale;

  const switchTo = (next: Locale) => {
    if (next === currentLocale) return;
    router.replace(
      // biome-ignore lint/suspicious/noExplicitAny: pathname<>params typing is too narrow for the dynamic case
      { pathname, params: params as any },
      { locale: next },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={t("label")}
          className="h-9 gap-1.5 px-2.5 font-medium"
        >
          <Globe className="size-4" aria-hidden="true" />
          <span aria-hidden="true">{localeFlags[currentLocale]}</span>
          <span className="uppercase">{currentLocale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {t("label")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((loc) => {
          const active = loc === currentLocale;
          return (
            <DropdownMenuItem
              key={loc}
              onSelect={() => switchTo(loc)}
              aria-current={active ? "true" : undefined}
              className="gap-2"
            >
              <span aria-hidden="true">{localeFlags[loc]}</span>
              <span className="flex-1">{localeNames[loc]}</span>
              {active ? <Check className="size-4 text-primary" aria-hidden="true" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
