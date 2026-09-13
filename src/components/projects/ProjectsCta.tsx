import { Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Kicker } from "@/components/about/Kicker";
import { Link } from "@/i18n/navigation";

/** La clôture de la page : une seule action. La maquette proposait aussi
 *  « Planifier un appel », qui ne menait à aucun outil de rendez-vous. */
export async function ProjectsCta() {
  const t = await getTranslations("Projects.cta");

  return (
    <section
      aria-labelledby="projects-cta-title"
      className="mx-auto mt-10 mb-14 w-[min(100%-2.5rem,82.5rem)]"
    >
      <div className="flex flex-col gap-6 rounded-2xl bg-board-sunk px-7 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <Kicker>{t("kicker")}</Kicker>
          <h2
            id="projects-cta-title"
            className="mt-3 text-[clamp(1.7rem,2.5vw,2.2rem)] font-bold leading-[1.05] tracking-[-0.03em] text-ink"
          >
            {t("title")}
          </h2>
          <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-ink-soft">
            {t("body")}
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex h-11 w-fit shrink-0 items-center gap-2.5 rounded-lg bg-copper px-6 text-[14px] font-semibold text-copper-ink shadow-lift-2 transition-[background-color,transform] hover:-translate-y-px hover:bg-copper-deep"
        >
          <Mail className="size-4" aria-hidden="true" />
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
