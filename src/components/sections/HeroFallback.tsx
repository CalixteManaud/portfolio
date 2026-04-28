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
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div className="hero-fallback-base absolute inset-0" />
      <div className="hero-fallback-accents absolute inset-0 opacity-30 mix-blend-overlay" />
    </div>
  );
}
