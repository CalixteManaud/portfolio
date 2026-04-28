import { SiGithub } from "@icons-pack/react-simple-icons";
import { Mail, Rss } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { Link } from "@/i18n/navigation";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export async function Footer() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-filter backdrop-blur-sm">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        {/* Brand */}
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex transition-opacity hover:opacity-80"
            aria-label="Accueil"
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
          <p className="max-w-xs text-sm text-foreground/60 leading-relaxed">{t("tagline")}</p>
        </div>

        {/* Nav */}
        <nav aria-label="Footer">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/40">
            {tNav("home")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/about"
                className="text-foreground/65 hover:text-foreground transition-colors"
              >
                {tNav("about")}
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="text-foreground/65 hover:text-foreground transition-colors"
              >
                {tNav("projects")}
              </Link>
            </li>
            <li>
              <Link
                href="/meetings"
                className="text-foreground/65 hover:text-foreground transition-colors"
              >
                {tNav("meetings")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-foreground/65 hover:text-foreground transition-colors"
              >
                {tNav("contact")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Socials */}
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/40">
            {t("social")}
          </p>
          <ul className="mt-3 flex flex-wrap gap-3">
            <SocialLink href="https://github.com/CalixteManaud" label="GitHub" icon={SiGithub} />
            <SocialLink href="https://linkedin.com" label="LinkedIn" icon={LinkedinIcon} />
            <SocialLink href="mailto:contact@warthoz.cloud" label="Email" icon={Mail} />
            <SocialLink href="/rss.xml" label="RSS" icon={Rss} />
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-foreground/45 md:flex-row md:items-center md:px-6">
          <p>
            © {year} · {t("rights")}
          </p>
          <p className="font-mono">Built with Next.js · React Three Fiber · MDX · ❤️</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: IconComponent;
}) {
  return (
    <li>
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        aria-label={label}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background/40 text-foreground/60 transition-colors hover:border-[oklch(0.70_0.28_240/0.5)] hover:text-[oklch(0.70_0.28_240)]"
      >
        <Icon className="size-4" aria-hidden="true" />
      </a>
    </li>
  );
}
