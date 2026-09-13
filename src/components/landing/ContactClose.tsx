import { ArrowRight, Laptop, Mail, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function ContactClose() {
  const t = await getTranslations("Landing.contact");
  const annot = t.raw("annot") as string[];
  const email = t("email");

  const info = [
    { id: "city", Icon: MapPin, text: t("city") },
    { id: "mode", Icon: Laptop, text: t("mode") },
    { id: "email", Icon: Mail, text: email, href: `mailto:${email}` },
  ];

  return (
    <section aria-labelledby="contact-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 -right-24 size-[520px] rounded-full bg-board-sunk/80" />
        <div className="dot-grid absolute top-8 right-6 hidden h-28 w-20 opacity-60 lg:block" />
      </div>

      <div className="container-page relative grid items-center gap-10 py-14 lg:grid-cols-[minmax(0,430px)_auto_1px_auto_minmax(0,1fr)] lg:gap-x-12 lg:py-[26px]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-copper-deep">
            <span aria-hidden="true">/ </span>
            {t("kicker")}
          </p>
          <h2
            id="contact-title"
            className="mt-2 whitespace-pre-line text-[clamp(1.7rem,2.2vw,1.9rem)] font-bold leading-[1.05] tracking-[-0.03em] text-ink"
          >
            {t("title")}
          </h2>
          <p className="mt-3 max-w-[380px] text-[13.5px] leading-relaxed text-ink-soft">
            {t("body")}
          </p>
        </div>

        <Link
          href="/contact"
          className="group inline-flex h-[42px] w-fit items-center gap-2 rounded-lg bg-copper px-5 text-[14px] font-semibold text-copper-ink shadow-lift-2 transition-[background-color,transform] hover:-translate-y-px hover:bg-copper-deep"
        >
          {t("cta")}
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>

        <span aria-hidden="true" className="hidden h-[110px] w-px bg-copper/50 lg:block" />

        <p className="w-fit -rotate-[10deg] font-hand text-[21px] leading-[1.1] text-ink/80">
          {annot.map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
          <span aria-hidden="true" className="mt-2 block h-[2px] w-14 rounded-full bg-copper" />
        </p>

        <ul
          aria-label={t("infoLabel")}
          className="space-y-3 text-[13px] text-ink lg:justify-self-end"
        >
          {info.map(({ id, Icon, text, href }) => (
            <li key={id} className="flex items-center gap-3">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-copper-tint text-copper-deep">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {href ? (
                <a href={href} className="transition-colors hover:text-copper-deep">
                  {text}
                </a>
              ) : (
                text
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
