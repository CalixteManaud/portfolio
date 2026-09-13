import type { ProjectMeta } from "@/lib/content";

export type ProjectKind = NonNullable<ProjectMeta["kind"]>;
export type ProjectCategory = ProjectMeta["categories"][number];

/** Ce que la grille reçoit du serveur : du texte déjà traduit, et l'image
 *  résolue au build (`null` tant que la capture n'est pas déposée). */
export type ProjectItem = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  kind?: ProjectKind;
  categories: ProjectCategory[];
  links: ProjectMeta["links"];
  image: string | null;
};
