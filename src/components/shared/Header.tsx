import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LangSwitcher } from "./LangSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";

export type NavHref = "/about" | "/projects" | "/meetings" | "/contact";

export async function Header() {
  const t = await getTranslations("Nav");

  const navItems: Array<{ href: NavHref; label: string }> = [
    { href: "/about", label: t("about") },
    { href: "/projects", label: t("projects") },
    { href: "/meetings", label: t("meetings") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-md supports-backdrop-filter:bg-background/55">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          aria-label={t("home")}
        >
          <Image
            src="/logo-wordmark.svg"
            alt="~/portfolio"
            width={130}
            height={20}
            priority
            className="h-5 w-auto"
            style={{ height: "auto" }}
          />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  );
}
