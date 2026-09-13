import { Quote } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  labelledBy: string;
  photo: string;
  photoAlt: string;
  /** Cadrage de la photo, par exemple `object-[center_30%]`. */
  photoPosition?: string;
  motto: string[];
  /** Le tracé à la main sous la devise (soulignement, couronne…). */
  doodle: ReactNode;
  /** Position de la devise sur grand écran, par exemple `lg:top-[13%] lg:left-[48%]`. */
  mottoClassName: string;
  quote: string;
  signature: string;
  quoteClassName?: string;
  containerClassName?: string;
  children: ReactNode;
};

function Motto({
  words,
  doodle,
  className,
}: {
  words: string[];
  doodle: ReactNode;
  className: string;
}) {
  return (
    <p
      aria-hidden="true"
      className={cn(
        "-rotate-[10deg] font-hand leading-[1.02] text-screen-ink [text-shadow:0_1px_14px_rgb(0_0_0/0.5)]",
        className,
      )}
    >
      {words.map((word) => (
        <span key={word} className="block">
          {word}
        </span>
      ))}
      {doodle}
    </p>
  );
}

/**
 * Le hero sombre des pages Compétences, Projets et Contact.
 * Sur grand écran, la photo occupe la droite et se fond vers le texte. En
 * dessous de lg, elle devient une bande à part, placée après le texte et sans
 * voile, qui porte la devise et la citation signée : le visiteur mobile voit
 * la photo au lieu d'un fantôme sous un aplat à 90 %.
 */
export function PhotoHero({
  labelledBy,
  photo,
  photoAlt,
  photoPosition,
  motto,
  doodle,
  mottoClassName,
  quote,
  signature,
  quoteClassName,
  containerClassName,
  children,
}: Props) {
  return (
    <section
      aria-labelledby={labelledBy}
      className="relative flex flex-col overflow-hidden bg-screen text-screen-ink lg:block"
    >
      <div className="relative order-last aspect-square w-full sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:order-none lg:aspect-auto lg:w-[58%]">
        <Image
          src={photo}
          alt={photoAlt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className={cn("object-cover", photoPosition)}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-screen via-screen/0 via-35% to-screen/55 lg:bg-gradient-to-r lg:from-screen lg:via-screen/55 lg:via-50% lg:to-screen/5"
        />
        <Motto
          words={motto}
          doodle={doodle}
          // En haut à gauche : les photos placent le visage vers 60 % de la
          // largeur, et une devise à droite le recouvrait.
          className="absolute top-6 left-6 text-[22px] lg:hidden"
        />
      </div>

      <div
        className={cn(
          "mx-auto w-[min(100%-2.5rem,82.5rem)] pt-14 pb-10 lg:relative",
          containerClassName,
        )}
      >
        {children}

        <Motto
          words={motto}
          doodle={doodle}
          className={cn("absolute hidden text-[30px] lg:block", mottoClassName)}
        />

        <figure
          className={cn(
            "absolute bottom-5 left-5 z-10 max-w-[260px] rounded-2xl border border-white/10 bg-screen/70 p-5 backdrop-blur-md sm:max-w-[300px] lg:right-0 lg:bottom-7 lg:left-auto",
            quoteClassName,
          )}
        >
          <Quote className="size-5 fill-copper-bright text-copper-bright" aria-hidden="true" />
          <blockquote className="mt-2 text-[14px] leading-snug text-screen-ink">{quote}</blockquote>
          <figcaption className="mt-3 text-right font-hand text-[24px] leading-none text-screen-ink">
            {signature}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
