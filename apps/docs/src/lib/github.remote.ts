import { prerender } from '$app/server';
import { site } from '$lib/site';

/** The repository's star count, read once per build. `null` when GitHub cannot be reached, so the link shows only its icon. */
export const githubStars = prerender(async () => {
  try {
    const response = await fetch(`https://api.github.com/repos/${new URL(site.github).pathname.slice(1)}`);
    if (!response.ok) return null;
    const { stargazers_count: count } = (await response.json()) as { stargazers_count: number };
    return count >= 1000 ? `${Math.round(count / 1000)}k` : count.toLocaleString('en-US');
  } catch {
    return null;
  }
});
