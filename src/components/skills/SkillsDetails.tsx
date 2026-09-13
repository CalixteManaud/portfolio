import { SiTerraform } from "@icons-pack/react-simple-icons";
import {
  Award,
  FolderOpen,
  Lightbulb,
  Quote,
  Rocket,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { Kicker } from "@/components/about/Kicker";
import { AwsMark } from "@/components/icons/AwsMark";
import { StackExplorer } from "./StackExplorer";

type Cert = { name: string; issuer: string; year: string };
type Lang = { code: string; name: string; level: string; steps: number };
type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const CERT_BADGES: Array<{
  Icon: ComponentType<SVGProps<SVGSVGElement> & { color?: string }>;
  color?: string;
}> = [{ Icon: SiTerraform, color: "default" }, { Icon: AwsMark }, { Icon: Award }];
const SOFT_ICONS: IconType[] = [UsersRound, Lightbulb, Rocket, UserRound, Sparkles, FolderOpen];
/** Échelle européenne, six marches. Langue maternelle = les six. */
const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

function SectionTitle({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  return (
    <>
      <Kicker tone="dark">{kicker}</Kicker>
      <h2
        id={id}
        className="mt-3 text-[clamp(1.6rem,2.3vw,2rem)] font-bold leading-[1.05] tracking-[-0.03em]"
      >
        {title}
      </h2>
    </>
  );
}

/**
 * La suite sombre de la page : la stack filtrable, les certifications et les
 * langues, les soft skills. Les langues sont notées sur l'échelle européenne,
 * pas en pourcentage : « B2 », c'est quatre marches sur six, et c'est vérifiable.
 */
export async function SkillsDetails() {
  const [tStack, tCerts, tLang, tSoft] = await Promise.all([
    getTranslations("Skills.stack"),
    getTranslations("Skills.certs"),
    getTranslations("Skills.languages"),
    getTranslations("Skills.soft"),
  ]);
  const certs = tCerts.raw("items") as Cert[];
  const langs = tLang.raw("items") as Lang[];
  const soft = tSoft.raw("items") as string[];

  return (
    <div className="bg-screen text-screen-ink">
      <section
        aria-labelledby="stack-title"
        className="mx-auto w-[min(100%-2.5rem,82.5rem)] pt-14 pb-12 lg:pt-[30px]"
      >
        <header className="flex flex-wrap items-end justify-between gap-x-12 gap-y-3">
          <div>
            <SectionTitle id="stack-title" kicker={tStack("kicker")} title={tStack("title")} />
          </div>
          <p className="text-[13px] text-screen-soft">{tStack("aside")}</p>
        </header>
        <StackExplorer />
      </section>

      <div className="mx-auto grid w-[min(100%-2.5rem,82.5rem)] gap-12 pb-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-14">
        <section aria-labelledby="certs-title">
          <SectionTitle id="certs-title" kicker={tCerts("kicker")} title={tCerts("title")} />
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {certs.map((cert, i) => {
              const badge: (typeof CERT_BADGES)[number] = CERT_BADGES[i] ?? { Icon: Award };
              const Badge = badge.Icon;
              return (
                <li
                  key={cert.name}
                  className="rounded-2xl border border-screen-rule bg-screen-raised p-5"
                >
                  <Badge
                    className={
                      i === 2
                        ? "h-9 w-auto max-w-12 text-copper-bright"
                        : "h-9 w-auto max-w-12 text-screen-ink"
                    }
                    color={badge.color}
                    aria-hidden="true"
                  />
                  <p className="mt-4 text-[14.5px] font-semibold leading-snug">{cert.name}</p>
                  {cert.issuer ? (
                    <p className="mt-1 text-[12.5px] text-screen-soft">{cert.issuer}</p>
                  ) : null}
                  <p className="text-[12.5px] tabular-nums text-screen-soft">{cert.year}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="langs-title">
          <SectionTitle id="langs-title" kicker={tLang("kicker")} title={tLang("title")} />
          <ul className="mt-5 space-y-5">
            {langs.map((lang) => (
              <li
                key={lang.code}
                className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-4"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex size-10 items-center justify-center rounded-full bg-screen-raised text-[12px] font-semibold tracking-wide text-copper-bright"
                >
                  {lang.code}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">{lang.name}</span>
                  <span className="block text-[12.5px] text-screen-soft">{lang.level}</span>
                </span>
                <span
                  role="img"
                  aria-label={`${lang.name} : ${lang.level}`}
                  title={tLang("scaleLabel")}
                  className="flex gap-1"
                >
                  {CEFR.map((level, step) => (
                    <span
                      key={level}
                      className={
                        step < lang.steps
                          ? "h-1.5 w-6 rounded-full bg-copper-bright"
                          : "h-1.5 w-6 rounded-full bg-screen-rule"
                      }
                    />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mx-auto grid w-[min(100%-2.5rem,82.5rem)] gap-10 pb-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-end lg:gap-14 lg:pb-[34px]">
        <section aria-labelledby="soft-title">
          <SectionTitle id="soft-title" kicker={tSoft("kicker")} title={tSoft("title")} />
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {soft.map((skill, i) => {
              const Icon = SOFT_ICONS[i] ?? Sparkles;
              return (
                <li
                  key={skill}
                  className="flex flex-col items-center gap-2.5 rounded-xl border border-screen-rule bg-screen-raised px-2 py-4 text-center text-[12.5px] font-medium leading-snug"
                >
                  <Icon
                    className="size-6 text-copper-bright"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  {skill}
                </li>
              );
            })}
          </ul>
        </section>

        <figure className="rounded-2xl border border-screen-rule bg-screen-raised p-6">
          <div className="flex items-start gap-4">
            <Quote
              className="mt-0.5 size-6 shrink-0 fill-copper-bright text-copper-bright"
              aria-hidden="true"
            />
            <blockquote className="text-[15.5px] leading-snug">{tSoft("quote")}</blockquote>
          </div>
          <figcaption className="mt-3 text-right font-hand text-[24px] leading-none">
            {tSoft("signature")}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
