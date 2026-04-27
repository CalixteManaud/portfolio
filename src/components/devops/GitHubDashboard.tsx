import { ArrowUpRight, GitFork, Star, Users } from "lucide-react";
import { fetchGitHubStats, type GitHubStats } from "@/lib/github";

export async function GitHubDashboard() {
  const result = await fetchGitHubStats();

  if (!result.ok) {
    return <DashboardSkeleton reason={result.reason} />;
  }

  return <DashboardContent stats={result.data} />;
}

function DashboardSkeleton({
  reason,
}: {
  reason: "no-token" | "no-username" | "fetch-failed";
}) {
  const message =
    reason === "no-token" || reason === "no-username"
      ? "GitHub stats are wired up — set GITHUB_TOKEN + GITHUB_USERNAME to light this up."
      : "GitHub API unreachable — try again in an hour.";
  return (
    <section className="rounded-2xl border border-border bg-card/40 p-8 text-foreground/65 backdrop-blur-sm">
      <p className="font-mono text-xs uppercase tracking-wider text-foreground/50">
        github.live
      </p>
      <p className="mt-2 text-sm">{message}</p>
    </section>
  );
}

function DashboardContent({ stats }: { stats: GitHubStats }) {
  const { user, repos, totals } = stats;

  return (
    <section
      aria-label="Live GitHub stats"
      className="space-y-6 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm md:p-8"
    >
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* biome-ignore lint/performance/noImgElement: avatars are external, optimization unnecessary */}
          <img
            src={user.avatar_url}
            alt={`${user.login} avatar`}
            width={48}
            height={48}
            className="size-12 rounded-full border border-border"
          />
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-foreground/50">
              github.live
            </p>
            <p className="text-lg font-semibold tracking-tight">
              @{user.login}
            </p>
          </div>
        </div>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-foreground/75 transition-colors hover:border-primary/50 hover:text-primary"
        >
          Open profile
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </header>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={Star} label="Stars" value={totals.stars} />
        <Stat icon={GitFork} label="Forks" value={totals.forks} />
        <Stat icon={Users} label="Followers" value={user.followers} />
        <Stat icon={Star} label="Repos" value={user.public_repos} />
      </ul>

      {totals.languages.length > 0 ? (
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-foreground/50">
            Top languages
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {totals.languages.map((l) => (
              <li
                key={l.name}
                className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[11px] text-foreground/75"
              >
                {l.name} · {l.count}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {repos.length > 0 ? (
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-foreground/50">
            Recent · top repos
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {repos.map((repo) => (
              <li key={repo.id}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 transition-all hover:border-primary/50 hover:bg-background/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground/90 group-hover:text-primary">
                      {repo.name}
                    </p>
                    {repo.description ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-foreground/60">
                        {repo.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground/65">
                      <Star className="size-3" aria-hidden="true" />
                      {repo.stargazers_count}
                    </p>
                    {repo.language ? (
                      <p className="mt-0.5 font-mono text-[10px] text-foreground/45">
                        {repo.language}
                      </p>
                    ) : null}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star;
  label: string;
  value: number;
}) {
  return (
    <li className="rounded-lg border border-border/60 bg-background/40 px-3 py-3">
      <p className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-foreground/50">
        <Icon className="size-3" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">
        {value.toLocaleString()}
      </p>
    </li>
  );
}
