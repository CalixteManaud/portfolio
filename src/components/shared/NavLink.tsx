"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type NavHref = "/about" | "/projects" | "/meetings" | "/contact";

export function NavLink({ href, children }: { href: NavHref; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex h-9 items-center rounded-md px-3 text-sm transition-colors",
        "text-foreground/65 hover:bg-muted/60 hover:text-foreground",
        "aria-[current=page]:text-foreground",
        "after:absolute after:bottom-1.5 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-primary/80 after:transition-transform after:duration-200",
        "hover:after:scale-x-100 aria-[current=page]:after:scale-x-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
      )}
    >
      {children}
    </Link>
  );
}
