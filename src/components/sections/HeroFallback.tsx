/**
 * Static visual served when:
 *   - the user prefers reduced motion
 *   - the 3D bundle hasn't streamed yet (next/dynamic loading state)
 *   - WebGL is unavailable
 *
 * Pure CSS gradient — zero JS, zero GPU.
 */
export function HeroFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.32 0.12 270) 0%, oklch(0.18 0.04 270) 45%, oklch(0.10 0.01 270) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, oklch(0.7 0.18 250) 0%, transparent 35%), radial-gradient(circle at 80% 70%, oklch(0.7 0.18 200) 0%, transparent 35%)",
        }}
      />
    </div>
  );
}
