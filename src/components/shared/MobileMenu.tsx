"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { Link } from "@/i18n/navigation";

type NavHref = "/about" | "/projects" | "/meetings" | "/contact";

export function MobileMenu() {
  const t = useTranslations("MobileMenu");
  const tNav = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  // Close on route change (App Router doesn't expose a router event we listen to here,
  // but the Link onClick below covers it).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const items: { href: NavHref; label: string }[] = [
    { href: "/about", label: tNav("about") },
    { href: "/projects", label: tNav("projects") },
    { href: "/meetings", label: tNav("meetings") },
    { href: "/contact", label: tNav("contact") },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t("open")}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background/40 text-foreground/85 transition-colors hover:bg-muted md:hidden"
        >
          <Menu className="size-4" aria-hidden="true" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-1 border-l border-border bg-background p-6 shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right md:hidden"
        >
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="font-mono text-xs uppercase tracking-wider text-foreground/60">
              {t("title")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("close")}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground/85 transition-colors hover:bg-muted"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Dialog.Close asChild>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-2.5 text-base text-foreground/85 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </Dialog.Close>
                </li>
              ))}
            </ul>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
