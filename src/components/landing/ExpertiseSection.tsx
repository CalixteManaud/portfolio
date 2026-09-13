import { ArrowRight, Box, ChartNoAxesColumn, Cloud, Code2, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { Link } from "@/i18n/navigation";
import { SectionHead } from "./SectionHead";

type DomainId = "cicd" | "iac" | "observability" | "security" | "web";

const DOMAINS: Array<{ id: DomainId; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = [
  { id: "cicd", Icon: Cloud },
  { id: "iac", Icon: Box },
  { id: "observability", Icon: ChartNoAxesColumn },
  { id: "security", Icon: ShieldCheck },
  { id: "web", Icon: Code2 },
];

export async function ExpertiseSection() {
  const t = await getTranslations("Landing.expertise");

  return (
    <section aria-labelledby="expertise-title" className="pt-10 lg:pt-[21px]">
      <div className="container-page">
        <SectionHead
          id="expertise-title"
          kicker={t("kicker")}
          title={t("title")}
          aside={t("aside")}
          action={{ kind: "link", href: "/skills", label: t("link") }}
        />

        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DOMAINS.map(({ id, Icon }, i) => (
            <li key={id}>
              <Reveal delay={i * 0.06} className="h-full">
                <Link
                  href="/skills"
                  className="group relative flex h-full min-h-[196px] flex-col rounded-2xl bg-screen p-5 text-screen-ink shadow-lift-2 ring-1 ring-white/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift-3"
                >
                  <Icon
                    className="size-8 text-copper-bright"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 text-[15.5px] font-semibold leading-tight tracking-[-0.01em]">
                    {t(`items.${id}.title`)}
                  </h3>
                  <p className="mt-2 pr-7 text-[12.5px] leading-[1.5] text-screen-soft">
                    {t(`items.${id}.body`)}
                  </p>
                  <span
                    aria-hidden="true"
                    className="absolute right-4 bottom-4 inline-flex size-7 items-center justify-center rounded-full bg-screen-raised text-screen-ink transition-colors duration-300 group-hover:bg-copper group-hover:text-copper-ink"
                  >
                    <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
