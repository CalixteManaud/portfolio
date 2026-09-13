import { existsSync } from "node:fs";
import path from "node:path";
import { Coffee, Handshake, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { Kicker } from "@/components/about/Kicker";
import { BrushUnderline } from "@/components/shared/Doodles";
import { PhotoHero } from "@/components/shared/PhotoHero";

type Feature = { title: string; body: string };

/** La photo du hero si elle a été déposée, sinon une photo existante. */
const PHOTO = existsSync(path.join(process.cwd(), "public", "photos", "contact-hero.webp"))
  ? "/photos/contact-hero.webp"
  : "/photos/quotidien-3.webp";

const FEATURE_ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [Zap, Handshake, Coffee];

export async function ContactHero() {
  const t = await getTranslations("Contact.hero");
  const features = t.raw("features") as Feature[];

  return (
    <PhotoHero
      labelledBy="contact-title"
      photo={PHOTO}
      photoAlt={t("photoAlt")}
      photoPosition="object-[center_25%]"
      motto={t.raw("motto") as string[]}
      doodle={<BrushUnderline className="mt-1 ml-6 text-copper-bright" />}
      mottoClassName="lg:top-[13%] lg:left-[49%]"
      quote={t("quote")}
      signature={t("signature")}
      containerClassName="lg:min-h-[480px] lg:py-[56px]"
    >
      <div className="max-w-[620px]">
        <Kicker tone="dark">{t("kicker")}</Kicker>
        <h1
          id="contact-title"
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

        <ul className="mt-9 grid gap-5 sm:grid-cols-3 sm:divide-x sm:divide-screen-rule">
          {features.map((feature, i) => {
            const Icon = FEATURE_ICONS[i] ?? Zap;
            return (
              <li key={feature.title} className="sm:px-5 sm:first:pl-0">
                <Icon className="size-6 text-copper-bright" strokeWidth={1.6} aria-hidden="true" />
                <p className="mt-3 text-[14px] font-semibold">{feature.title}</p>
                <p className="mt-0.5 text-[12.5px] text-screen-soft">{feature.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </PhotoHero>
  );
}
