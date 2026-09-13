import { SiGithub } from "@icons-pack/react-simple-icons";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { Link } from "@/i18n/navigation";
import { HeroMonogram } from "./HeroMonogram";

type Stat = { value: string; label: string };

/** Entrée en scène : fondu montant, déjà visible sous reduced-motion. */
const enter =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-700 motion-safe:ease-out motion-safe:fill-mode-both";

export async function LandingHero() {
  const t = await getTranslations("Landing.hero");
  const stats = t.raw("stats") as Stat[];
  const annot = t.raw("annot") as string[];
  const roles = t.raw("roles") as string[];
  const location = t.raw("location") as string[];

  const socials = [
    { href: "https://github.com/CalixteManaud", label: "GitHub", Icon: SiGithub },
    {
      href: "https://www.linkedin.com/in/manaud-calixte-b5a2201b1/",
      label: "LinkedIn",
      Icon: LinkedinIcon,
    },
    { href: "mailto:contact@devcorporation.fr", label: t("mail"), Icon: Mail },
  ];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Décor : le grand disque clair derrière le portrait et les trames de
          points des marges. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-90px] left-[calc(50%+40px)] size-[620px] rounded-full bg-board-sunk/80" />
        <div className="dot-grid absolute bottom-8 left-3 h-40 w-24 opacity-70" />
        <div className="dot-grid absolute top-24 right-4 hidden h-44 w-20 opacity-60 xl:block" />
      </div>

      <div className="container-page relative grid gap-6 lg:grid-cols-[minmax(0,540px)_minmax(0,1fr)] lg:gap-10">
        <div className="relative z-10 flex flex-col pt-8 lg:min-h-[536px] lg:pt-[23px] lg:pb-6">
          <p
            className={`${enter} inline-flex w-fit items-center gap-2 rounded-full border border-rule bg-chalk/80 px-3.5 py-[7px] text-[12.5px] font-medium text-ink shadow-lift-1`}
          >
            <span className="size-2 rounded-full bg-go" aria-hidden="true" />
            {t("badge")}
          </p>

          <h1
            id="hero-title"
            className={`${enter} mt-5 text-[clamp(2.3rem,3.4vw,3rem)] font-bold leading-[1.06] tracking-[-0.038em] text-ink [animation-delay:80ms]`}
          >
            {t.rich("title", {
              accent: (chunks) => <span className="text-copper">{chunks}</span>,
              br: () => <br className="hidden lg:inline" />,
            })}
          </h1>

          <p
            className={`${enter} mt-4 max-w-[480px] text-pretty text-[15px] leading-[1.42] text-ink-soft [animation-delay:160ms]`}
          >
            {t("lede")}
          </p>

          <div className={`${enter} mt-6 flex flex-wrap gap-3 [animation-delay:240ms]`}>
            <Link
              href="/contact"
              className="group inline-flex h-[42px] items-center gap-2 rounded-lg bg-copper px-5 text-[14px] font-semibold text-copper-ink shadow-lift-2 transition-[background-color,transform] hover:-translate-y-px hover:bg-copper-deep"
            >
              {t("ctaPrimary")}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/projects"
              className="inline-flex h-[42px] items-center rounded-lg border border-rule bg-chalk px-5 text-[14px] font-semibold text-ink shadow-lift-1 transition-colors hover:border-copper/50"
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          <dl
            aria-label={t("statsLabel")}
            className={`${enter} mt-7 grid max-w-[505px] grid-cols-3 divide-x divide-rule [animation-delay:320ms]`}
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end px-5 first:pl-0">
                <dt className="mt-1 text-[12.5px] leading-snug text-ink-soft">{s.label}</dt>
                <dd className="whitespace-nowrap text-[25px] font-bold leading-none tracking-[-0.02em] text-ink">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          <div
            className={`${enter} mt-7 flex items-center gap-5 pb-8 lg:pb-0 [animation-delay:400ms]`}
          >
            <span className="text-[12.5px] text-ink-soft">{t("follow")}</span>
            <ul className="flex items-center gap-5">
              {socials.map(({ href, label, Icon }) => {
                const external = href.startsWith("http");
                return (
                  <li key={href}>
                    <a
                      href={href}
                      aria-label={label}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="inline-flex text-ink transition-colors hover:text-copper-deep"
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* La scène : le monogramme en relief, le portrait devant, puis les
            deux cartes posées sur la droite. */}
        <div className="relative isolate h-[360px] sm:h-[500px] lg:h-[536px]">
          <HeroMonogram className="absolute top-[13%] left-[-3.4%] h-[62%] w-[101.8%]" />

          <Image
            src="/landing/hero-portrait.png"
            alt={t("portraitAlt")}
            width={1200}
            height={1021}
            priority
            sizes="(max-width: 1024px) 92vw, 600px"
            className={`${enter} absolute bottom-0 left-[3%] z-10 h-auto w-[94%] select-none sm:left-[8%] sm:w-[84%] lg:left-0 lg:w-[94.6%] [animation-delay:120ms]`}
          />

          <p className="absolute top-[52%] left-[2%] z-20 -rotate-[14deg] font-hand text-[19px] leading-[1.05] text-ink sm:left-[9%] lg:top-[50%] lg:left-[10.9%] lg:text-[24px]">
            {annot.map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
            <span aria-hidden="true" className="mt-1.5 block h-[2px] w-12 rounded-full bg-copper" />
          </p>

          <aside
            className={`absolute top-[6%] right-0 z-30 hidden w-[190px] rounded-2xl bg-screen p-5 text-screen-ink shadow-lift-3 ring-1 ring-white/5 sm:block lg:top-[8.6%] lg:right-auto lg:left-[76.4%] lg:w-[207px] [animation-delay:260ms]`}
          >
            <span
              aria-hidden="true"
              className="absolute top-4 right-4 size-2 rounded-full bg-copper-bright"
            />
            <Image
              src="/landing/logo-mark-light.png"
              alt=""
              width={1070}
              height={510}
              className="h-7 w-auto"
            />
            <ul className="mt-5 space-y-0.5 text-[15.5px] leading-snug">
              {roles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
            <span
              aria-hidden="true"
              className="mt-5 block h-[2px] w-9 rounded-full bg-copper-bright"
            />
            <p className="mt-3 whitespace-pre-line font-mono text-[12px] leading-snug text-screen-soft">
              {t("tagline")}
            </p>
          </aside>

          <div
            className={`${enter} absolute right-0 bottom-4 z-20 flex w-[206px] items-center gap-3 rounded-xl bg-chalk/95 p-3 shadow-lift-2 ring-1 ring-rule/60 lg:top-[80.2%] lg:right-auto lg:bottom-auto lg:left-[76.7%] [animation-delay:340ms]`}
          >
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-copper-tint text-copper-deep">
              <MapPin className="size-4" aria-hidden="true" />
            </span>
            <ul className="text-[12px] leading-[1.4]">
              {location.map((line, i) => (
                <li key={line} className={i === 0 ? "font-semibold text-ink" : "text-ink-soft"}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
