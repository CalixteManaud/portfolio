"use client";

import { Link, usePathname } from "@/i18n/navigation";
import type { NavHref } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function NavLink({ href, children }: { href: NavHref; children: React.ReactNode }) {
  const pathname = usePathname();
  // L'accueil ne s'active que sur lui-même : sinon, tout chemin commençant
  // par « / » l'allumerait.
  const active =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex h-10 items-center text-[14.5px] font-medium transition-colors",
        "text-ink-soft hover:text-ink aria-[current=page]:text-ink",
        "after:absolute after:inset-x-0 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-copper after:transition-transform after:duration-300 after:ease-out",
        "hover:after:scale-x-100 aria-[current=page]:after:scale-x-100",
      )}
    >
      {children}
    </Link>
  );
}
