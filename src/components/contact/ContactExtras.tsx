import { existsSync } from "node:fs";
import path from "node:path";
import { BriefcaseBusiness, Coffee, MapPin, MessagesSquare, UsersRound } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { Kicker } from "@/components/about/Kicker";
import { BrushUnderline } from "@/components/shared/Doodles";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Intent = { title: string; body: string };
type Faq = { q: string; a: string };

const INTENT_ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  UsersRound,
  BriefcaseBusiness,
  MessagesSquare,
  Coffee,
];

/** Marseille de nuit, affichée seulement une fois déposée. */
const CITY = existsSync(path.join(process.cwd(), "public", "photos", "contact-marseille.webp"))
  ? "/photos/contact-marseille.webp"
  : null;

const MAPS_URL = "https://www.google.com/maps/place/Marseille";

export async function ContactIntents() {
  const t = await getTranslations("Contact.intents");
  const items = t.raw("items") as Intent[];

  return (
    <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => {
        const Icon = INTENT_ICONS[i] ?? UsersRound;
        return (
          <li
            key={item.title}
            className="rounded-2xl border border-rule bg-chalk p-6 shadow-lift-1"
          >
            <Icon
              className="size-8 fill-copper/25 text-copper"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <p className="mt-4 text-[16px] font-semibold text-ink">{item.title}</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{item.body}</p>
          </li>
        );
      })}
    </ul>
  );
}

/** La localisation et la FAQ, côte à côte sur fond sombre. */
export async function ContactBottom() {
  const [tLoc, tFaq] = await Promise.all([
    getTranslations("Contact.location"),
    getTranslations("Contact.faq"),
  ]);
  const note = tLoc.raw("note") as string[];
  const faqs = tFaq.raw("items") as Faq[];

  return (
    <div className="mt-5 mb-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <section
        aria-labelledby="location-title"
        className="relative min-h-[280px] overflow-hidden rounded-2xl bg-screen p-8 text-screen-ink"
      >
        {CITY ? (
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-[62%] [mask-image:linear-gradient(to_right,transparent,black_45%)]"
          >
            <Image
              src={CITY}
              alt=""
              fill
              sizes="(max-width: 1024px) 60vw, 380px"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-[62%] [background-image:radial-gradient(rgb(240_235_228/0.2)_1px,transparent_1.3px)] [background-size:14px_14px] [mask-image:linear-gradient(to_right,transparent,black_45%)]"
          >
            <span className="absolute right-[22%] bottom-[26%] inline-flex size-11 items-center justify-center rounded-full bg-copper-bright/15 ring-1 ring-copper-bright/40">
              <MapPin className="size-5 text-copper-bright" />
            </span>
          </div>
        )}

        <div className="relative max-w-[330px]">
          <Kicker tone="dark">{tLoc("kicker")}</Kicker>
          <h2
            id="location-title"
            className="mt-3 text-[clamp(1.5rem,2.1vw,1.8rem)] font-bold leading-[1.1] tracking-[-0.03em]"
          >
            {tLoc.rich("title", { br: () => <br /> })}
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-screen-soft">{tLoc("body")}</p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-copper-bright px-5 text-[14px] font-semibold text-screen transition-[filter,transform] hover:-translate-y-px hover:brightness-110"
          >
            <MapPin className="size-4" aria-hidden="true" />
            {tLoc("cta")}
          </a>
        </div>

        <p
          aria-hidden="true"
          className="absolute top-8 right-8 hidden -rotate-[10deg] font-hand text-[26px] leading-[1.05] text-screen-ink [text-shadow:0_1px_14px_rgb(0_0_0/0.5)] md:block"
        >
          {note.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <BrushUnderline className="mt-1 ml-4 text-copper-bright" />
        </p>
      </section>

      <section aria-labelledby="faq-title" className="rounded-2xl bg-screen p-8 text-screen-ink">
        <Kicker tone="dark">{tFaq("kicker")}</Kicker>
        <h2
          id="faq-title"
          className="mt-3 text-[clamp(1.5rem,2.1vw,1.8rem)] font-bold leading-[1.1] tracking-[-0.03em]"
        >
          {tFaq("title")}
        </h2>
        <Accordion type="single" collapsible className="mt-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.q}
              value={faq.q}
              className="mb-2 rounded-lg border border-screen-rule bg-screen-raised px-4 last:mb-0"
            >
              <AccordionTrigger className="-mx-2 px-2 py-3.5 text-[14px] font-medium text-screen-ink hover:no-underline **:data-[slot=accordion-trigger-icon]:text-copper-bright">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-[13.5px] leading-relaxed text-screen-soft">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
