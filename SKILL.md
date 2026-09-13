---
name: calixte-portfolio-design
description: Use this skill to generate well-branded interfaces and assets for Calixte Manaud's personal DevOps/DevSecOps portfolio. Loads the project's real design system — colors, typography, layout, components, and the named rules that govern them.
user-invocable: true
---

Read [`DESIGN.md`](./DESIGN.md) first — it is the authority on this project's visual system (tokens in the
YAML frontmatter are normative; the prose explains how to apply them). Then read [`PRODUCT.md`](./PRODUCT.md)
for durable product truth: audience, positioning, and what must never be fabricated.

`.impeccable/design.json` carries what the DESIGN.md frontmatter cannot: tonal ramps, shadow and motion
tokens, breakpoints, and self-contained HTML/CSS snippets for the canonical components.

The implemented source of truth for colors is the `:root` block of `src/styles/globals.css`. Never hard-code
a color anywhere else — components, shaders, and OG images all reference those twelve primitives.

If creating visual artifacts (slides, mocks, throwaway prototypes), produce static HTML files the user can
open, and keep them on-system: cold slate ground, Ambre Sodium as the single brand accent used sparingly,
Archivo at `wdth 112` for signage, IBM Plex Sans for reading, IBM Plex Mono for data. If working on
production code, follow DESIGN.md's Do's and Don'ts as hard constraints.

If the user invokes this skill without further guidance, ask what they want to build or design, ask a couple
of focused questions, then act as an expert designer who outputs either HTML artifacts or production code,
depending on the need.
