"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavHref } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

type Item = { href: NavHref; label: string };

export function MobileMenu({ items }: { items: Item[] }) {
  const t = useTranslations("MobileMenu");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t("open")} className="lg:hidden">
          <Menu className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs">
        <SheetHeader className="border-b border-border/60">
          <SheetTitle className="font-mono text-xs uppercase tracking-wider text-foreground/60">
            {t("title")}
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-2">
          <ul className="space-y-0.5">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-base text-foreground/80 transition-colors",
                      "hover:bg-muted hover:text-foreground",
                      active && "bg-muted/70 text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-6 px-5 sm:hidden">
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
