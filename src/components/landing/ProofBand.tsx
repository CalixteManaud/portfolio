import { SiGithub } from "@icons-pack/react-simple-icons";
import { ArrowRight, Check, ExternalLink, Layers, Rocket, Server } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/animations/Reveal";
import type { Locale } from "@/i18n/config";
import { listEntries } from "@/lib/content";
import { fetchContributionCalendar, fetchGitHubStats, fetchLatestRun } from "@/lib/github";
import { checkLive } from "@/lib/status";
import { cn } from "@/lib/utils";
import { ProofTabs } from "./ProofTabs";
import { SectionHead } from "./SectionHead";

const GITHUB_URL = "https://github.com/CalixteManaud";
const FALLBACK_LIVE = "https://portfolio.devcorporation.fr";
const WEEKS = 20;
const STAGES = ["quality", "build", "security", "deploy"] as const;
const LEVELS = [
  "bg-screen-rule/70",
  "bg-go-bright/25",
  "bg-go-bright/45",
  "bg-go-bright/70",
  "bg-go-bright",
] as const;

/**
 * La bande de preuve. Tout ce qui y ressemble à une mesure en est une :
 * compteurs et calendrier GitHub, dernier run de la CI, disponibilité du site.
 * Quand une source ne répond pas, le panneau le dit au lieu d'afficher le
 * chiffre flatteur que montrait la maquette.
 */
export async function ProofBand({ locale }: { locale: Locale }) {
  const [t, format, projects] = await Promise.all([
    getTranslations("Landing.proof"),
    getFormatter(),
    listEntries("projects", locale),
  ]);

  const links = (projects.find((p) => p.meta.slug === "portfolio-3d") ?? projects[0])?.meta.links;
  const liveUrl = links?.live ?? FALLBACK_LIVE;
  const [stats, calendar, run, live] = await Promise.all([
    fetchGitHubStats(),
    fetchContributionCalendar(WEEKS),
    fetchLatestRun(links?.repo),
    checkLive(liveUrl),
  ]);

  const user = stats.ok ? stats.data.user : null;
  const counts = [
    { id: "repos", value: user?.public_repos },
    { id: "followers", value: user?.followers },
    { id: "following", value: user?.following },
  ] as const;

  // Toujours 20 × 7 cases : une grille vide reste lisible comme « pas de
  // données », là où une grille absente laisserait un trou dans le panneau.
  const weeks = calendar ?? Array.from({ length: WEEKS }, () => Array<number>(7).fill(0));
  const cells = weeks.flatMap((days, w) =>
    Array.from({ length: 7 }, (_, d) => ({ id: `w${w}d${d}`, level: days[d] ?? -1 })),
  );

  const passed = run?.conclusion === "success";
  const host = new URL(liveUrl).host;

  return (
    <section
      aria-labelledby="proof-title"
      className="relative mt-14 overflow-hidden bg-screen py-12 text-screen-ink lg:mt-4 lg:pt-[29px] lg:pb-[30px]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute top-10 -left-24 h-px w-80 rotate-[35deg] bg-copper-bright/20" />
        <span className="absolute -right-20 bottom-16 h-px w-72 -rotate-[35deg] bg-copper-bright/20" />
        <div className="dot-grid-screen absolute top-8 right-6 hidden h-40 w-24 opacity-60 xl:block" />
      </div>

      <div className="container-page relative">
        <SectionHead
          id="proof-title"
          tone="dark"
          kicker={t("kicker")}
          title={t("title")}
          aside={t("aside")}
          action={{ kind: "external", href: GITHUB_URL, label: t("cta") }}
        />

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[278fr_205fr_236fr]">
          <Reveal>
            <section className="h-full rounded-2xl border border-copper-bright/30 bg-screen-raised p-3">
              <h3 className="sr-only">{t("tabs.terminal")}</h3>
              <ProofTabs />
            </section>
          </Reveal>

          <Reveal delay={0.08}>
            <section className="flex h-full flex-col rounded-2xl border border-screen-rule bg-screen-raised p-5">
              <div className="flex items-center gap-3">
                <SiGithub className="size-9 text-screen-ink" aria-hidden="true" />
                <div>
                  <h3 className="text-[14px] font-semibold">GitHub</h3>
                  <p className="text-[12.5px] text-screen-soft">@CalixteManaud</p>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-2">
                {counts.map(({ id, value }) => (
                  <div key={id} className="flex flex-col-reverse">
                    <dt className="mt-0.5 text-[12px] text-screen-soft">{t(`github.${id}`)}</dt>
                    <dd className="text-[21px] font-semibold leading-none tabular-nums">
                      {value ?? "—"}
                    </dd>
                  </div>
                ))}
              </dl>

              <div
                role="img"
                aria-label={calendar ? t("github.activity") : t("github.unavailable")}
                className="mt-5 grid w-fit grid-flow-col grid-rows-7 gap-[3px]"
              >
                {cells.map(({ id, level }) => (
                  <span
                    key={id}
                    className={cn(
                      "size-[11px] rounded-[3px]",
                      level < 0 ? "invisible" : LEVELS[level],
                    )}
                  />
                ))}
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-[12px]">
                <span className="text-screen-soft">
                  {calendar ? t("github.activity") : t("github.unavailable")}
                </span>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 font-semibold text-copper-bright transition-colors hover:text-screen-ink"
                >
                  {t("github.more")}
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </section>
          </Reveal>

          <div className="flex flex-col gap-4">
            <Reveal delay={0.16}>
              <section className="rounded-2xl border border-screen-rule bg-screen-raised p-5">
                <header className="flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2.5 text-[14px] font-semibold">
                    <Rocket
                      className="size-5 text-copper-bright"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                    {t("pipeline.title")}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11.5px] font-medium",
                      passed ? "bg-go-bright/12 text-go-bright" : "bg-screen-sunk text-screen-soft",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 rounded-full",
                        passed ? "bg-go-bright" : "bg-screen-soft",
                      )}
                    />
                    {t("pipeline.env")}
                  </span>
                </header>

                <ol className="mt-4 flex items-start rounded-xl bg-screen-sunk px-2 py-3">
                  {STAGES.map((stage, i) => (
                    <li key={stage} className="relative flex flex-1 flex-col items-center gap-1.5">
                      {i > 0 ? (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute top-3 right-1/2 h-px w-full",
                            passed ? "bg-go-bright/50" : "bg-screen-rule",
                          )}
                        />
                      ) : null}
                      <span
                        className={cn(
                          "relative z-10 inline-flex size-6 items-center justify-center rounded-full",
                          passed
                            ? "bg-go-bright text-screen"
                            : "border border-screen-rule bg-screen text-screen-soft",
                        )}
                      >
                        {passed ? (
                          <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                        ) : (
                          <span className="text-[10px] tabular-nums">{i + 1}</span>
                        )}
                      </span>
                      <span className="text-[11.5px] text-screen-soft">
                        {t(`pipeline.stages.${stage}`)}
                      </span>
                    </li>
                  ))}
                </ol>

                <p className="mt-3 text-[12px] text-screen-soft">
                  {run
                    ? t(`pipeline.${run.conclusion}`, {
                        when: format.relativeTime(new Date(run.updatedAt), new Date()),
                      })
                    : t("pipeline.none")}
                </p>
              </section>
            </Reveal>

            <Reveal delay={0.24}>
              <section className="rounded-2xl border border-screen-rule bg-screen-raised p-5">
                <h3 className="flex items-center gap-2.5 text-[14px] font-semibold">
                  <Server
                    className="size-5 text-copper-bright"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  {t("production.title")}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-screen-sunk p-3">
                  <Layers
                    className="size-7 shrink-0 text-copper-bright"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1 basis-[11rem]">
                    <p className="text-[13.5px] font-semibold">{t("production.name")}</p>
                    <p className="font-mono text-[11.5px] break-all text-screen-soft">{host}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium",
                      live === "online" && "bg-go-bright/12 text-go-bright",
                      live === "offline" && "bg-stop/15 text-stop",
                      live === "unknown" && "bg-screen text-screen-soft",
                    )}
                  >
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                    {t(`production.${live}`)}
                  </span>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("production.open")}
                    className="shrink-0 text-screen-soft transition-colors hover:text-screen-ink"
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
