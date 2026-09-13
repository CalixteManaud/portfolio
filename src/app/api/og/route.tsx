import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Next 16 déprécie le runtime edge. @vercel/og fonctionne aussi bien en
// runtime Node, qui reste la cible recommandée — et qui donne accès au disque
// pour charger les vraies faces du site.
export const runtime = "nodejs";

/**
 * Palette de la carte OG.
 *
 * Satori ne comprend ni `oklch()` ni `color-mix()` : ces valeurs sont les
 * conversions sRGB exactes des primitives de `globals.css`, seul endroit du
 * projet où une couleur est dupliquée. Elles ne sont pas choisies à l'œil ;
 * si une primitive change, il faut les recalculer.
 */
const IMG = {
  board: "#ede6da", // --board, le plan de travail
  chalk: "#faf8f4", // --chalk
  ink: "#14110e", // --ink
  inkSoft: "#534f4a", // --ink-soft
  rule: "#d1cbc2", // --rule
  copper: "#c08a54", // --copper, la couleur du logo
  steel: "#8a8880", // --steel
} as const;

/** Repli quand l'appelant ne fournit pas de sous-titre. Constante séparée : sous
 *  `noUncheckedIndexedAccess`, un accès indexé rend `string | undefined`, et le
 *  repli doit être garanti. */
const DEFAULT_SUBTITLE = "DevOps · DevSecOps · Développeur web";

const SUBTITLE_BY_TYPE: Record<string, string> = {
  project: "Projet",
  meeting: "Rencontre",
};

/** Les faces réelles du site. `Archivo-Struck-Bold` est l'instance figée à
 *  wdth 92 / wght 700 — la frappe resserrée du monde de l'Établi. Sans elle,
 *  Archivo retombe sur sa chasse par défaut et la signalétique perd exactement
 *  ce qui la caractérise. */
async function loadFonts() {
  const dir = path.join(process.cwd(), "public", "fonts");
  const [display, mono] = await Promise.all([
    readFile(path.join(dir, "Archivo-Struck-Bold.ttf")),
    readFile(path.join(dir, "JetBrainsMono-Regular.ttf")),
  ]);
  return [
    { name: "Archivo", data: display, weight: 700 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = (searchParams.get("title") ?? "Portfolio").slice(0, 120);
  const type = searchParams.get("type") ?? "default";
  const subtitle = searchParams.get("subtitle") ?? SUBTITLE_BY_TYPE[type] ?? DEFAULT_SUBTITLE;

  const fonts = await loadFonts();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: IMG.board,
        color: IMG.ink,
        padding: "72px 80px",
        fontFamily: "Archivo",
        // La lumière de l'établi, transposée : une nappe de craie venue du haut
        // gauche, une touche de cuivre en bas à droite. Jamais de texture de bois.
        backgroundImage: `radial-gradient(circle at 12% -10%, ${IMG.chalk}, transparent 62%), radial-gradient(circle at 95% 105%, ${IMG.copper}22, transparent 58%)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 10, height: 10, borderRadius: 999, background: IMG.copper }} />
        <div
          style={{
            fontSize: 24,
            color: IMG.copper,
            fontFamily: "JetBrains Mono",
            letterSpacing: 4,
          }}
        >
          ~/portfolio
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div
          style={{
            fontSize: title.length > 60 ? 64 : 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: subtitle.length > 44 ? 24 : 28,
            color: IMG.inkSoft,
            fontFamily: "JetBrains Mono",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Le nom figure sur chaque carte, pas seulement sur celle de la home :
          une vignette de projet partagée dans un Slack doit dire qui l'a faite. */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 20,
          color: IMG.inkSoft,
          fontFamily: "JetBrains Mono",
          borderTop: `1px solid ${IMG.rule}`,
          paddingTop: 28,
        }}
      >
        <span>$ ./prove --it</span>
        <span style={{ color: IMG.ink }}>Manaud Calixte · portfolio.devcorporation.fr</span>
      </div>
    </div>,
    { width: 1200, height: 630, fonts },
  );
}
