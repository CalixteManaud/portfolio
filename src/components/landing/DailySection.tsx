"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHead } from "./SectionHead";

const SHOTS = [
  { id: "dev", src: "/photos/quotidien-1.webp" },
  { id: "analysis", src: "/photos/quotidien-2.webp" },
  { id: "share", src: "/photos/quotidien-3.webp" },
  { id: "focus", src: "/photos/quotidien-4.webp" },
] as const;

const arrow =
  "static size-9 translate-x-0 translate-y-0 rounded-full border-rule bg-chalk text-ink shadow-lift-1 hover:border-copper/50 hover:bg-chalk hover:text-copper-deep disabled:bg-board-sunk disabled:opacity-100 disabled:text-ink-soft/60";

export function DailySection() {
  const t = useTranslations("Landing.daily");

  return (
    <section aria-labelledby="daily-title" className="pt-14 lg:pt-[46px]">
      <div className="container-page">
        <Carousel opts={{ align: "start" }}>
          <SectionHead
            id="daily-title"
            kicker={t("kicker")}
            title={t("title")}
            aside={t("aside")}
            controls={
              <div className="flex gap-2">
                <CarouselPrevious aria-label={t("prev")} className={arrow} />
                <CarouselNext aria-label={t("next")} className={arrow} />
              </div>
            }
          />

          <CarouselContent className="mt-5 -ml-4">
            {SHOTS.map((shot) => (
              <CarouselItem key={shot.id} className="basis-[82%] pl-4 sm:basis-1/2 lg:basis-1/4">
                <figure className="group rounded-2xl bg-chalk p-2 shadow-lift-1 ring-1 ring-rule/60">
                  <div className="relative aspect-[11/10] overflow-hidden rounded-xl">
                    <Image
                      src={shot.src}
                      alt={t(`items.${shot.id}.alt`)}
                      fill
                      sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 280px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <figcaption className="px-2 pt-3 pb-1.5">
                    <p className="text-[14px] font-semibold text-ink">
                      {t(`items.${shot.id}.title`)}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-ink-soft">
                      {t(`items.${shot.id}.body`)}
                    </p>
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
