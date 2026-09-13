import {
  Cloud,
  Code2,
  Database,
  Infinity as InfinityIcon,
  ShieldHalf,
  UsersRound,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { Kicker } from "@/components/about/Kicker";
import { Reveal } from "@/components/animations/Reveal";

type DomainId = "devops" | "cloud" | "web" | "devsecops" | "data" | "soft";

/**
 * Les six domaines. La maquette leur donnait une jauge de maîtrise en
 * pourcentage — une auto-évaluation qu'aucun recruteur ne peut vérifier. À la
 * place, chaque carte nomme les outils réels du domaine : on peut en parler en
 * entretien, et ils se retrouvent dans la stack juste en dessous.
 */
const DOMAINS: Array<{
  id: DomainId;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  tools?: string[];
}> = [
  { id: "devops", Icon: InfinityIcon, tools: ["GitLab CI", "Jenkins", "Terraform", "Kubernetes"] },
  { id: "cloud", Icon: Cloud, tools: ["AWS", "Docker", "Helm"] },
  { id: "web", Icon: Code2, tools: ["Next.js", "JavaScript", "TypeScript"] },
  { id: "devsecops", Icon: ShieldHalf, tools: ["Trivy", "SonarQube"] },
  { id: "data", Icon: Database, tools: ["PostgreSQL", "MongoDB", "Supabase"] },
  { id: "soft", Icon: UsersRound },
];

export const DOMAIN_COUNT = DOMAINS.length;

export async function SkillsDomains() {
  const t = await getTranslations("Skills.domains");

  return (
    <section aria-labelledby="domains-title" className="bg-chalk py-12 lg:py-[34px]">
      <div className="mx-auto w-[min(100%-2.5rem,82.5rem)]">
        <header className="flex flex-wrap items-end justify-between gap-x-12 gap-y-3">
          <div>
            <Kicker>{t("kicker")}</Kicker>
            <h2
              id="domains-title"
              className="mt-3 text-[clamp(1.8rem,2.6vw,2.3rem)] font-bold leading-[1.05] tracking-[-0.035em] text-ink"
            >
              {t("title")}
            </h2>
          </div>
          <p className="max-w-[22rem] text-balance text-[13px] leading-snug text-ink-soft">
            {t("aside")}
          </p>
        </header>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {DOMAINS.map(({ id, Icon, tools }, i) => {
            const pills = tools ?? (t.raw("items.soft.tools") as string[]);
            return (
              <li key={id}>
                <Reveal delay={i * 0.05} className="h-full">
                  <article className="flex h-full flex-col items-center rounded-2xl bg-screen px-4 pt-6 pb-5 text-center text-screen-ink shadow-lift-2 ring-1 ring-white/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift-3">
                    <Icon
                      className="size-8 text-copper-bright"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                    <h3 className="mt-4 text-[15.5px] font-semibold tracking-[-0.01em]">
                      {t(`items.${id}.title`)}
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-screen-soft">
                      {t(`items.${id}.body`)}
                    </p>
                    <ul
                      aria-label={tools ? t("toolsLabel") : t("softLabel")}
                      className="mt-auto flex flex-wrap justify-center gap-1 pt-4"
                    >
                      {pills.map((pill) => (
                        <li
                          key={pill}
                          className="rounded-md bg-screen-raised px-2 py-0.5 text-[11px] text-screen-ink/85"
                        >
                          {pill}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
