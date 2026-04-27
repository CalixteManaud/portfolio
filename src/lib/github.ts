import "server-only";

import { env } from "@/lib/env";

const API = "https://api.github.com";

type GitHubUser = {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
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
      fetch(
        `${API}/users/${username}/repos?per_page=100&sort=updated&type=owner`,
        { headers: headers(), next: { revalidate: REVALIDATE } },
      ),
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
        repos: repos
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6),
        totals: { stars, forks, languages, lastPushed },
      },
    };
  } catch (err) {
    console.error("[github] fetch error:", err);
    return { ok: false, reason: "fetch-failed" };
  }
}
