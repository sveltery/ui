type PagefindResult = { id: string; data: () => Promise<{ url: string; excerpt: string; meta: { title?: string } }> };
type Pagefind = { init?: () => Promise<void>; debouncedSearch: (query: string, options?: object, ms?: number) => Promise<{ results: PagefindResult[] } | null> };

export type Hit = { href: string; title: string; excerpt: string };

let pagefind: Promise<Pagefind | null> | undefined;

/** Pagefind exists only in a built site, where `pnpm build` indexes the prerendered pages. */
function loadPagefind() {
  const url = '/pagefind/pagefind.js';
  pagefind ??= import(/* @vite-ignore */ url)
    .then(async (module: Pagefind) => (await module.init?.(), module))
    .catch(() => null);
  return pagefind;
}

/** Full-text search over the docs. `available` stays false in `vite dev`, where there is no index. */
export class FullTextSearch {
  hits = $state<Hit[]>([]);
  available = $state(false);

  async run(query: string) {
    const engine = await loadPagefind();
    this.available = engine !== null;
    if (!engine || !query.trim()) return (this.hits = []);
    const search = await engine.debouncedSearch(query, {}, 150);
    if (!search) return; // A newer query superseded this one.
    const data = await Promise.all(search.results.slice(0, 8).map((result) => result.data()));
    this.hits = data.map((hit) => ({ href: hit.url.replace(/\.html$/, '').replace(/\/index$/, '') || '/', title: hit.meta.title ?? hit.url, excerpt: hit.excerpt }));
  }
}
