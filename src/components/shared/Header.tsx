import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LangSwitcher } from "./LangSwitcher";
import { MobileMenu } from "./MobileMenu";

export async function Header() {
  const t = await getTranslations("Nav");

  const navItems: Array<{
    href: "/" | "/about" | "/projects" | "/meetings" | "/contact";
    label: string;
  }> = [
    { href: "/about", label: t("about") },
    { href: "/projects", label: t("projects") },
    { href: "/meetings", label: t("meetings") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/40 bg-background/40 backdrop-blur-md supports-[backdrop-filter]:bg-background/40">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          <span aria-hidden="true">~/</span>
          <span>portfolio</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
