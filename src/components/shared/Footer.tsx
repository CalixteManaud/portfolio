import { SiGithub } from "@icons-pack/react-simple-icons";
import { Mail } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { Link } from "@/i18n/navigation";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const SOCIALS: Array<{ href: string; label: string; icon: IconComponent }> = [
  { href: "https://github.com/CalixteManaud", label: "GitHub", icon: SiGithub },
  {
    href: "https://www.linkedin.com/in/manaud-calixte-b5a2201b1/",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
  { href: "mailto:contact@devcorporation.fr", label: "Email", icon: Mail },
];

export async function Footer() {
  const [t, tNav, tl] = await Promise.all([
    getTranslations("Footer"),
    getTranslations("Nav"),
    getTranslations("Landing.header"),
  ]);
  const year = new Date().getFullYear();

  const navItems: Array<{ href: "/about" | "/skills" | "/projects" | "/contact"; label: string }> =
    [
      { href: "/about", label: tNav("about") },
      { href: "/projects", label: tNav("projects") },
      { href: "/skills", label: tNav("skills") },
      { href: "/contact", label: tNav("contact") },
    ];

  return (
    <footer className="border-t border-rule/60 bg-chalk/70">
      <div className="container-page flex flex-col gap-7 py-9 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-[26px]">
        <Link
          href="/"
          aria-label={tl("homeLabel")}
          className="flex w-fit items-center gap-3 rounded-md transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo-mark.png"
            alt=""
            width={1070}
            height={510}
            className="h-[30px] w-auto dark:hidden"
          />
          <Image
            src="/landing/logo-mark-light.png"
            alt=""
            width={1070}
            height={510}
            className="hidden h-[30px] w-auto dark:block"
          />
          <span className="flex flex-col">
            <span className="text-[13px] font-bold uppercase leading-tight tracking-[0.12em] text-ink">
              Manaud Calixte
            </span>
            <span className="whitespace-nowrap text-[11.5px] leading-tight text-ink-soft">
              {tl("sub")}
            </span>
          </span>
        </Link>

        <nav aria-label={t("navigation")}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] lg:flex-nowrap">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="whitespace-nowrap text-ink-soft transition-colors hover:text-copper-deep"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:flex-nowrap">
          <ul className="flex items-center gap-5">
            {SOCIALS.map(({ href, label, icon: Icon }) => {
              const external = href.startsWith("http");
              return (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="inline-flex text-ink transition-colors hover:text-copper-deep"
                  >
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
          <span aria-hidden="true" className="hidden h-6 w-px bg-rule sm:block" />
          <p className="whitespace-nowrap text-[12px] text-ink-soft">
            © {year} Manaud Calixte ·{" "}
            <Link href="/legal" className="underline-offset-4 hover:text-ink hover:underline">
              {t("legal")}
            </Link>
            {" · "}
            <Link href="/privacy" className="underline-offset-4 hover:text-ink hover:underline">
              {t("privacy")}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
