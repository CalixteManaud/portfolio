import "server-only";

export type LiveStatus = "online" | "offline" | "unknown";

/**
 * Le site répond-il ? Une requête HEAD, relancée au plus toutes les cinq
 * minutes.
 *
 * Seul un 2xx vaut « en ligne », et seul un 5xx vaut « injoignable ». Tout le
 * reste (429, erreur réseau, build sans accès sortant) reste « inconnu » : un
 * rate-limit ou une CI hors ligne ne doivent pas faire afficher une panne qui
 * n'existe pas.
 */
export async function checkLive(url: string): Promise<LiveStatus> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) return "online";
    return res.status >= 500 ? "offline" : "unknown";
  } catch {
    return "unknown";
  }
}
