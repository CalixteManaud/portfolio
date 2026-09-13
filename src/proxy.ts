import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Routage i18n uniquement (pas d'auth, pas de session).
 *
 * Nommé `proxy.ts` : Next 16 a renommé la convention `middleware` en `proxy`.
 * L'API et la signature sont inchangées, seul le nom de fichier compte.
 */
export default createMiddleware(routing);

export const config = {
  // Toutes les routes sauf l'API, les internes Next et les fichiers statiques.
  // `.*\\..*` exclut tout chemin contenant un point : c'est ce qui laisse passer
  // /rss.xml et /sitemap.xml directement vers leurs route handlers.
  //
  // Le double antislash est indispensable : dans une chaîne JS, "\." s'évalue en
  // ".", le motif devient `.*..*` qui matche n'importe quel chemin, et le
  // lookahead négatif exclut alors TOUTES les routes. Le proxy ne tourne plus,
  // aucun pathname localisé n'est réécrit, et chaque lien de navigation tombe
  // en 404 — sans la moindre erreur au build.
  matcher: ["/((?!api|_next|_vercel|monitoring|models|textures|fonts|fallbacks|.*\\..*).*)"],
};
