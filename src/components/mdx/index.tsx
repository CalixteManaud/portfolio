import type { MDXComponents } from "mdx/types";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";

export const mdxComponents: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={`mt-12 scroll-mt-24 text-balance text-4xl font-bold tracking-tight ${className ?? ""}`}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={`mt-12 scroll-mt-24 border-b border-border pb-2 text-3xl font-semibold tracking-tight ${className ?? ""}`}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={`mt-8 scroll-mt-24 text-2xl font-semibold tracking-tight ${className ?? ""}`}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={`mt-4 leading-relaxed text-foreground/85 ${className ?? ""}`}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={`text-primary underline-offset-4 hover:underline ${className ?? ""}`}
      {...props}
    />
  ),
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
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={`mt-6 border-l-4 border-primary/50 bg-muted/30 px-4 py-2 italic text-foreground/80 ${className ?? ""}`}
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
