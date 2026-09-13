import { existsSync } from "node:fs";
import path from "node:path";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { FolderKanban, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Kicker } from "@/components/about/Kicker";
import { BrushUnderline } from "@/components/shared/Doodles";
import { PhotoHero } from "@/components/shared/PhotoHero";
import { fetchGitHubStats } from "@/lib/github";

/** La photo du hero si elle a été déposée, sinon la pose la plus proche
 *  parmi les photos existantes (au travail sur l'ordinateur portable). */
const PHOTO = existsSync(path.join(process.cwd(), "public", "photos", "projects-hero.webp"))
  ? "/photos/projects-hero.webp"
  : "/photos/quotidien-1.webp";

/**
 * Les trois chiffres sont des mesures : le nombre de fiches réellement
 * publiées dans `content/projects`, le nombre de dépôts publics lu sur l'API
 * GitHub, et les utilisateurs servis revendiqués par le CV. La maquette
 * affichait « 10+ projets » et « 5 stacks » sans source.
 */
export async function ProjectsHero({ projectCount }: { projectCount: number }) {
  const [t, stats] = await Promise.all([getTranslations("Projects.hero"), fetchGitHubStats()]);
  const repos = stats.ok ? stats.data.user.public_repos : null;

  const figures = [
    { id: "projects", value: String(projectCount), Icon: FolderKanban },
    ...(repos === null ? [] : [{ id: "repos", value: String(repos), Icon: SiGithub }]),
    { id: "users", value: t("usersValue"), Icon: Users },
  ] as const;

  return (
    <PhotoHero
      labelledBy="projects-title"
      photo={PHOTO}
      photoAlt={t("photoAlt")}
      photoPosition="object-[center_30%]"
      motto={t.raw("motto") as string[]}
      doodle={<BrushUnderline className="mt-1 ml-6 text-copper-bright" />}
      mottoClassName="lg:top-[13%] lg:left-[48%]"
      quote={t("quote")}
      signature={t("signature")}
      containerClassName="lg:min-h-[480px] lg:py-[56px]"
    >
      <div className="max-w-[600px]">
        <Kicker tone="dark">{t("kicker")}</Kicker>
        <h1
          id="projects-title"
          className="mt-4 text-[clamp(2.3rem,3.8vw,3.3rem)] font-bold leading-[1.04] tracking-[-0.04em]"
        >
          {t.rich("title", {
            accent: (chunks) => <span className="text-copper-bright">{chunks}</span>,
            br: () => <br className="hidden sm:inline" />,
          })}
        </h1>
        <p className="mt-5 max-w-[540px] text-[16px] leading-relaxed text-screen-soft">
          {t("lede")}
        </p>

        <dl
          aria-label={t("statsLabel")}
          className="mt-9 grid grid-cols-3 gap-4 sm:max-w-[520px] sm:divide-x sm:divide-screen-rule"
        >
          {figures.map(({ id, value, Icon }) => (
            <div key={id} className="flex flex-col-reverse justify-end sm:px-5 sm:first:pl-0">
              <dt className="text-[12.5px] leading-snug text-screen-soft">{t(`stats.${id}`)}</dt>
              <dd className="mb-1 flex flex-col gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-lg border border-copper-bright/50 text-copper-bright">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="text-[22px] font-bold leading-none tracking-[-0.02em]">
                  {value}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </PhotoHero>
  );
}
