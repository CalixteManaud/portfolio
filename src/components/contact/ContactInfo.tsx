import { SiGithub } from "@icons-pack/react-simple-icons";
import { CalendarCheck, Link2, Mail, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { type ComponentType, Fragment, type ReactNode, type SVGProps } from "react";
import { Kicker } from "@/components/about/Kicker";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { CopyButton } from "./CopyButton";

type RowId = "email" | "location" | "website" | "github" | "linkedin";

/**
 * Les coordonnées publiques. Le numéro de téléphone et l'adresse Gmail du CV
 * ne sont pas publiés : PRODUCT.md les réserve, et l'adresse publique est
 * contact@devcorporation.fr.
 */
const ROWS: Array<{
  id: RowId;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  value?: string;
  href?: string;
}> = [
  {
    id: "email",
    Icon: Mail,
    value: "contact@devcorporation.fr",
    href: "mailto:contact@devcorporation.fr",
  },
  { id: "location", Icon: MapPin },
  {
    id: "website",
    Icon: Link2,
    value: "portfolio.devcorporation.fr",
    href: "https://portfolio.devcorporation.fr",
  },
  {
    id: "github",
    Icon: SiGithub,
    value: "github.com/CalixteManaud",
    href: "https://github.com/CalixteManaud",
  },
  {
    id: "linkedin",
    Icon: LinkedinIcon,
    value: "linkedin.com/in/manaud-calixte-b5a2201b1",
    href: "https://www.linkedin.com/in/manaud-calixte-b5a2201b1/",
  },
];

/** Des points de coupure après « @ » et « / » : sur mobile, une adresse
 *  longue passe à la ligne à un endroit lisible (« contact@ » puis
 *  « devcorporation.fr ») au lieu d'être tronquée ou coupée en plein mot.
 *  `<wbr>` ne s'insère pas dans le texte copié. */
function breakable(value: string): ReactNode[] {
  let offset = 0;
  return value.split(/(?<=[@/])/).map((part) => {
    const key = offset;
    offset += part.length;
    return (
      <Fragment key={key}>
        {key > 0 ? <wbr /> : null}
        {part}
      </Fragment>
    );
  });
}

export async function ContactInfo() {
  const t = await getTranslations("Contact.info");

  return (
    <section
      aria-labelledby="info-title"
      className="flex flex-col rounded-2xl border border-rule bg-chalk p-5 shadow-lift-1 sm:p-7 lg:p-8"
    >
      <Kicker>{t("kicker")}</Kicker>
      <h2
        id="info-title"
        className="mt-3 text-[clamp(1.6rem,2.2vw,1.9rem)] font-bold leading-[1.05] tracking-[-0.03em] text-ink"
      >
        {t("title")}
      </h2>
      <p className="mt-2 text-[13.5px] text-ink-soft">{t("intro")}</p>

      {/* mb-5 garde l'écart minimal ; le bloc de disponibilité (mt-auto) se
          cale en bas de la carte quand le formulaire voisin est plus haut. */}
      <ul className="mt-5 mb-5 space-y-2">
        {ROWS.map(({ id, Icon, value, href }) => {
          const label = t(`labels.${id}`);
          const shown = value ?? t("locationValue");
          const external = href?.startsWith("http");
          return (
            <li
              key={id}
              className="flex items-center gap-3 rounded-xl bg-board px-3 py-3 sm:gap-3.5 sm:px-3.5"
            >
              <span className="inline-flex size-9 shrink-0 sm:size-10 items-center justify-center rounded-full bg-copper-tint text-copper-deep">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] text-ink-soft">{label}</span>
                {href ? (
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="block text-[13px] font-semibold break-words text-ink transition-colors hover:text-copper-deep sm:text-[14px]"
                  >
                    {breakable(shown)}
                  </a>
                ) : (
                  <span className="block text-[13px] font-semibold break-words text-ink sm:text-[14px]">
                    {shown}
                  </span>
                )}
              </span>
              <CopyButton
                value={shown}
                label={t("copyLabel", { label })}
                copiedLabel={t("copied")}
              />
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex items-center gap-4 rounded-2xl bg-screen px-5 py-4 text-screen-ink">
        <CalendarCheck
          className="size-7 shrink-0 text-copper-bright"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold">{t("status.title")}</p>
          <p className="text-[12.5px] text-screen-soft">{t("status.body")}</p>
        </div>
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-go-bright" />
      </div>
    </section>
  );
}
