import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";

/**
 * rehype-autolink-headings enveloppe le contenu de chaque titre dans un <a>
 * (behavior: "wrap"). Sans neutraliser le style de lien à l'intérieur, tous les
 * titres prendraient la couleur d'accent et la page entière virerait à l'ambre.
 */
const HEADING_ANCHOR = "[&_a]:text-inherit [&_a]:no-underline";

export const mdxComponents: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={`mt-12 scroll-mt-24 text-balance font-display text-4xl font-bold tracking-tight ${HEADING_ANCHOR} ${className ?? ""}`}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={`mt-12 scroll-mt-24 border-b border-border pb-2 font-display text-2xl font-semibold tracking-tight ${HEADING_ANCHOR} ${className ?? ""}`}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={`mt-8 scroll-mt-24 font-display text-xl font-semibold tracking-tight ${HEADING_ANCHOR} ${className ?? ""}`}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p className={`mt-4 leading-relaxed text-foreground/85 ${className ?? ""}`} {...props} />
  ),
  /* Un lien interne du MDX (« /privacy ») passe par le Link localisé : il
     mène à /confidentialite en français, à /en/privacy en anglais, au lieu de
     renvoyer tout le monde vers la langue par défaut. */
  a: ({ className, href, children }) => {
    const classes = `text-primary underline-offset-4 hover:underline ${className ?? ""}`;
    if (href?.startsWith("/") && !href.startsWith("//")) {
      return (
        <Link href={href as ComponentProps<typeof Link>["href"]} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  },
  ul: ({ className, ...props }) => (
    <ul
      className={`mt-4 ml-6 list-disc space-y-2 text-foreground/85 ${className ?? ""}`}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={`mt-4 ml-6 list-decimal space-y-2 text-foreground/85 ${className ?? ""}`}
      {...props}
    />
  ),
  /* Filet d'un pixel plutôt qu'une barre d'accent de 4px : le système ne tient
     sa hiérarchie que par l'opacité des traits, jamais par leur épaisseur. */
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={`mt-6 border-l border-copper/60 bg-muted/30 py-2 pl-5 pr-4 italic text-foreground/80 ${className ?? ""}`}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={`rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] ${className ?? ""}`}
      {...props}
    />
  ),
  pre: CodeBlock,
  Callout,
};
