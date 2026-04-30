import { SiGithub } from "@icons-pack/react-simple-icons";
import { Mail, Rss } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const SOCIALS: Array<{ href: string; label: string; icon: IconComponent }> = [
  { href: "https://github.com/CalixteManaud", label: "GitHub", icon: SiGithub },
  { href: "https://linkedin.com", label: "LinkedIn", icon: LinkedinIcon },
  { href: "mailto:contact@warthoz.cloud", label: "Email", icon: Mail },
  { href: "/rss.xml", label: "RSS", icon: Rss },
];

export async function Footer() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const year = new Date().getFullYear();

  const navItems: Array<{
    href: "/about" | "/projects" | "/meetings" | "/contact";
    label: string;
  }> = [
    { href: "/about", label: tNav("about") },
    { href: "/projects", label: tNav("projects") },
    { href: "/meetings", label: tNav("meetings") },
    { href: "/contact", label: tNav("contact") },
  ];

  return (
    <footer className="mt-24 border-t border-border/40 bg-background/40 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              aria-label={tNav("home")}
            >
              <Image
                src="/logo-wordmark.svg"
                alt="~/portfolio"
                width={130}
                height={20}
                className="h-5 w-auto"
                style={{ height: "auto" }}
              />
            </Link>
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <ul className="flex flex-wrap gap-2">
              {SOCIALS.map(({ href, label, icon: Icon }) => {
                const isExternal = href.startsWith("http");
                return (
                  <li key={label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild variant="outline" size="icon" aria-label={label}>
                          <a
                            href={href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                          >
                            <Icon className="size-4" aria-hidden="true" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>

          <FooterColumn title={tNav("home")}>
            {navItems.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("legal")}>
            <FooterLink href="/legal">{t("legal")}</FooterLink>
            <FooterLink href="/privacy">{t("privacy")}</FooterLink>
          </FooterColumn>
        </div>

        <Separator className="my-8 bg-border/40" />

        <div className="flex flex-col items-start justify-between gap-2 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {year} · {t("rights")}
          </p>
          <p className="font-mono">Built with Next.js · React Three Fiber · MDX</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  if (isExternal) {
    return (
      <li>
        <a
          href={href}
          className="text-foreground/70 transition-colors hover:text-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link
        // biome-ignore lint/suspicious/noExplicitAny: footer accepts arbitrary internal paths
        href={href as any}
        className="text-foreground/70 transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
