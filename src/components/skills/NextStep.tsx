import { existsSync } from "node:fs";
import path from "node:path";
import { Send } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Kicker } from "@/components/about/Kicker";
import { ArrowDoodle } from "@/components/shared/Doodles";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** La nature morte de l'appel à l'action, affichée seulement une fois déposée. */
const DESK = existsSync(path.join(process.cwd(), "public", "photos", "skills-desk.webp"))
  ? "/photos/skills-desk.webp"
  : null;

export async function NextStep() {
  const t = await getTranslations("Skills.next");
  const note = t.raw("note") as string[];

  return (
    <section
      aria-labelledby="next-title"
      className="relative overflow-hidden border-t border-screen-rule bg-screen-sunk text-screen-ink"
    >
      <div className={cn("grid", DESK && "lg:grid-cols-2")}>
        {DESK ? (
          <div
            aria-hidden="true"
            className="relative hidden min-h-[300px] [mask-image:linear-gradient(to_right,black_70%,transparent)] lg:block"
          >
            <Image src={DESK} alt="" fill sizes="50vw" className="object-cover" />
          </div>
        ) : null}

        <div
          className={cn(
            "relative py-14 lg:py-[40px]",
            DESK
              ? "px-[clamp(1.25rem,4vw,3rem)] lg:pr-[4vw] lg:pl-4"
              : "mx-auto w-[min(100%-2.5rem,82.5rem)]",
          )}
        >
          <Kicker tone="dark">{t("kicker")}</Kicker>
          <h2
            id="next-title"
            className="mt-3 text-[clamp(1.7rem,2.5vw,2.2rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          >
            {t("title")}
          </h2>
          <p className="mt-3 max-w-[480px] text-[15px] leading-relaxed text-screen-soft">
            {t("body")}
          </p>
          <Link
            href="/contact"
            className="group mt-6 inline-flex h-11 items-center gap-2.5 rounded-lg bg-copper-bright px-6 text-[14px] font-semibold text-screen transition-[filter,transform] hover:-translate-y-px hover:brightness-110"
          >
            <Send
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
            {t("cta")}
          </Link>

          <p
            aria-hidden="true"
            className={cn(
              "absolute top-1/2 hidden -translate-y-1/2 -rotate-[10deg] font-hand text-[30px] leading-[1.02] text-copper-bright md:block",
              // Avec la photo, la note garde une marge : rotée à -10°, elle
              // débordait du bord droit de la fenêtre.
              DESK ? "right-14" : "left-[55%]",
            )}
          >
            {note.map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
            <ArrowDoodle className="mt-1 ml-10" />
          </p>
        </div>
      </div>
    </section>
  );
}
