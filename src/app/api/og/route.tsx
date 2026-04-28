import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const SUBTITLE_BY_TYPE: Record<string, string> = {
  project: "Project · Portfolio",
  meeting: "Encounter · Portfolio",
  default: "DevOps · DevSecOps · Web",
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = (searchParams.get("title") ?? "Portfolio").slice(0, 120);
  const type = searchParams.get("type") ?? "default";
  const subtitle =
    searchParams.get("subtitle") ?? SUBTITLE_BY_TYPE[type] ?? SUBTITLE_BY_TYPE.default;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0a0a14",
        color: "#e8e8f0",
        padding: "72px 80px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(167,139,250,0.28), transparent 55%), radial-gradient(circle at 90% 90%, rgba(34,211,238,0.18), transparent 55%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "#a78bfa",
            boxShadow: "0 0 24px rgba(167,139,250,0.8)",
          }}
        />
        <div
          style={{
            fontSize: 26,
            color: "#a78bfa",
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          ~/portfolio
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            fontSize: title.length > 60 ? 64 : 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 30, color: "#a8a8b8" }}>{subtitle}</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 20,
          color: "#888",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
        }}
      >
        <span>$ ./prove --it</span>
        <span>warthoz.cloud</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
