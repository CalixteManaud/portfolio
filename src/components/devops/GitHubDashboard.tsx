import { ArrowUpRight, GitFork, Star, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchGitHubStats, type GitHubStats } from "@/lib/github";

export async function GitHubDashboard() {
  const result = await fetchGitHubStats();
  if (!result.ok) return <DashboardSkeleton reason={result.reason} />;
  return <DashboardContent stats={result.data} />;
}

function DashboardSkeleton({ reason }: { reason: "no-token" | "no-username" | "fetch-failed" }) {
  const message =
    reason === "no-token" || reason === "no-username"
      ? "GitHub stats are wired up — set GITHUB_TOKEN + GITHUB_USERNAME to light this up."
      : "GitHub API unreachable — try again in an hour.";
  return <p className="text-sm text-muted-foreground">{message}</p>;
}

function DashboardContent({ stats }: { stats: GitHubStats }) {
  const { user, repos, totals } = stats;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarImage src={user.avatar_url} alt={`${user.login} avatar`} />
            <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-semibold tracking-tight">@{user.login}</p>
            {user.name ? <p className="text-xs text-muted-foreground">{user.name}</p> : null}
          </div>
        </div>
        <Button asChild size="sm" variant="outline">
          <a href={user.html_url} target="_blank" rel="noopener noreferrer">
            Profile
            <ArrowUpRight className="size-3.5" aria-hidden="true" data-icon="inline-end" />
          </a>
        </Button>
      </div>

      <Separator />

      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Stat icon={Star} label="Stars" value={totals.stars} />
        <Stat icon={GitFork} label="Forks" value={totals.forks} />
        <Stat icon={Users} label="Followers" value={user.followers} />
        <Stat icon={Star} label="Repos" value={user.public_repos} />
      </ul>

      {totals.languages.length > 0 ? (
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Top languages
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {totals.languages.map((l) => (
              <li key={l.name}>
                <Badge variant="secondary" className="font-mono">
                  {l.name} · {l.count}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {repos.length > 0 ? (
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Top repositories
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {repos.map((repo) => (
              <li key={repo.id}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-background/70"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground/90 group-hover:text-primary">
                      {repo.name}
                    </p>
                    {repo.description ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {repo.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground/70">
                      <Star className="size-3" aria-hidden="true" />
                      {repo.stargazers_count}
                    </p>
                    {repo.language ? (
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
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
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: number }) {
  return (
    <li className="rounded-lg border border-border/60 bg-background/40 px-3 py-3">
      <p className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">
        {value.toLocaleString()}
      </p>
    </li>
  );
}
