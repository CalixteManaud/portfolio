import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { NavHref } from "@/i18n/routing";
import { LangSwitcher } from "./LangSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";

export type { NavHref } from "@/i18n/routing";

export async function Header() {
  const [t, tl] = await Promise.all([getTranslations("Nav"), getTranslations("Landing.header")]);

  const navItems: Array<{ href: NavHref; label: string }> = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/skills", label: t("skills") },
    { href: "/projects", label: t("projects") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-rule/70 bg-chalk/85 backdrop-blur-md">
      <div className="container-page flex h-[68px] items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={tl("homeLabel")}
          className="flex shrink-0 items-center gap-3 rounded-md transition-opacity hover:opacity-80"
        >
          {/* Le monogramme est noir et cuivre : en thème sombre, sa variante
              claire prend le relais plutôt qu'un filtre qui dénaturerait le cuivre. */}
          <Image
            src="/logo-mark.png"
            alt=""
            width={1070}
            height={510}
            priority
            className="h-[34px] w-auto dark:hidden"
          />
          <Image
            src="/landing/logo-mark-light.png"
            alt=""
            width={1070}
            height={510}
            priority
            className="hidden h-[34px] w-auto dark:block"
          />
          <span className="flex flex-col">
            <span className="text-[12.5px] font-bold uppercase leading-tight tracking-[0.1em] text-ink sm:text-[14.5px] sm:tracking-[0.12em]">
              Manaud Calixte
            </span>
            <span className="hidden text-[11.5px] leading-tight text-ink-soft sm:block">
              {tl("sub")}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Link
            href="/contact"
            className="ml-1 hidden h-10 items-center gap-2 rounded-lg bg-copper px-5 text-[14px] font-semibold text-copper-ink shadow-lift-1 transition-[background-color,transform] hover:-translate-y-px hover:bg-copper-deep sm:inline-flex"
          >
            {tl("cta")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  );
}
