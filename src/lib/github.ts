import "server-only";

import { env } from "@/lib/env";

const API = "https://api.github.com";

type GitHubUser = {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
};

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  html_url: string;
  topics: string[];
  fork: boolean;
};

export type GitHubStats = {
  user: GitHubUser;
  repos: GitHubRepo[];
  totals: {
    stars: number;
    forks: number;
    languages: { name: string; count: number }[];
    lastPushed: string | null;
  };
};

export type GitHubFetchResult =
  | { ok: true; data: GitHubStats }
  | { ok: false; reason: "no-token" | "no-username" | "fetch-failed" };

const headers = (): HeadersInit => {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (env.GITHUB_TOKEN) h.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  return h;
};

export async function fetchGitHubStats(): Promise<GitHubFetchResult> {
  if (!env.GITHUB_TOKEN) return { ok: false, reason: "no-token" };
  if (!env.GITHUB_USERNAME) return { ok: false, reason: "no-username" };

  const username = env.GITHUB_USERNAME;
  const REVALIDATE = 3600;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${API}/users/${username}`, {
        headers: headers(),
        next: { revalidate: REVALIDATE },
      }),
      fetch(`${API}/users/${username}/repos?per_page=100&sort=updated&type=owner`, {
        headers: headers(),
        next: { revalidate: REVALIDATE },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return { ok: false, reason: "fetch-failed" };
    }

    const user = (await userRes.json()) as GitHubUser;
    const allRepos = (await reposRes.json()) as GitHubRepo[];
    const repos = allRepos.filter((r) => !r.fork);

    const langMap = new Map<string, number>();
    let stars = 0;
    let forks = 0;
    let lastPushed: string | null = null;
    for (const r of repos) {
      stars += r.stargazers_count;
      forks += r.forks_count;
      if (r.language) {
        langMap.set(r.language, (langMap.get(r.language) ?? 0) + 1);
      }
      if (!lastPushed || r.pushed_at > lastPushed) lastPushed = r.pushed_at;
    }

    const languages = [...langMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      ok: true,
      data: {
        user,
        repos: repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6),
        totals: { stars, forks, languages, lastPushed },
      },
    };
  } catch (err) {
    console.error("[github] fetch error:", err);
    return { ok: false, reason: "fetch-failed" };
  }
}

/** Calendrier de contributions : semaines × jours, niveaux 0 à 4 (quartiles GitHub). */
export type ContributionCalendar = number[][];

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

type CalendarResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: { contributionDays?: { contributionLevel?: string }[] }[];
        };
      };
    };
  };
};

/** Les `weeks` dernières semaines du calendrier réel, ou `null` : jamais de
 *  relief procédural ici, la bande de preuve n'affiche que du mesuré. */
export async function fetchContributionCalendar(weeks = 20): Promise<ContributionCalendar | null> {
  if (!env.GITHUB_TOKEN || !env.GITHUB_USERNAME) return null;

  const query = `
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks { contributionDays { contributionLevel } }
          }
        }
      }
    }`;

  try {
    const res = await fetch(`${API}/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: env.GITHUB_USERNAME } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as CalendarResponse;
    const all = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
    if (all.length === 0) return null;
    return all
      .slice(-weeks)
      .map((week) =>
        (week.contributionDays ?? []).map((day) => LEVELS[day.contributionLevel ?? "NONE"] ?? 0),
      );
  } catch (err) {
    console.error("[github] contribution calendar error:", err);
    return null;
  }
}

export type LatestRun = {
  conclusion: "success" | "failure" | "running" | "other";
  updatedAt: string;
  url: string;
};

/** Dernier run GitHub Actions sur `main` du dépôt donné, ou `null` si le dépôt
 *  n'existe pas encore publiquement ou n'a jamais tourné. */
export async function fetchLatestRun(repoUrl: string | undefined): Promise<LatestRun | null> {
  const match = repoUrl?.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!match) return null;

  try {
    const res = await fetch(
      `${API}/repos/${match[1]}/${match[2]}/actions/runs?per_page=1&branch=main`,
      {
        headers: headers(),
        next: { revalidate: 600 },
      },
    );
    if (!res.ok) return null;

    const json = (await res.json()) as {
      workflow_runs?: {
        status: string;
        conclusion: string | null;
        updated_at: string;
        html_url: string;
      }[];
    };
    const run = json.workflow_runs?.[0];
    if (!run) return null;

    const conclusion =
      run.status !== "completed"
        ? "running"
        : run.conclusion === "success"
          ? "success"
          : run.conclusion === "failure"
            ? "failure"
            : "other";
    return { conclusion, updatedAt: run.updated_at, url: run.html_url };
  } catch {
    return null;
  }
}
