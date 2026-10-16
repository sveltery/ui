import { error } from '@sveltejs/kit';
import type { DocModule } from './types';

const modules = import.meta.glob<DocModule>(['/content/docs/**/*.md', '!**/README.md']);
const sources = import.meta.glob<string>(['/content/docs/**/*.md', '!**/README.md'], { query: '?raw', import: 'default' });

/** Pages with their own route, such as a page whose demo posts to a form action, which cannot be prerendered. */
const routed = ['forms/form-actions'];

const file = (slug: string) => {
  const path = [`/content/docs/${slug}.md`, `/content/docs/${slug ? `${slug}/` : ''}index.md`].find((candidate) => candidate in modules);
  if (!path) error(404, 'Page not found');
  return path;
};

/** Every page's slug, such as `components/button`, with `''` for the introduction. */
export const allSlugs = () => Object.keys(modules).map((path) => path.replace(/^\/content\/docs\//, '').replace(/\.md$/, '').replace(/(^|\/)index$/, ''));

export const slugs = () => allSlugs().filter((slug) => !routed.includes(slug));

/** The page's markdown file as written, frontmatter included. */
export const loadSource = (slug: string) => sources[file(slug)]();

export async function loadDoc(slug: string) {
  const [module, raw] = await Promise.all([modules[file(slug)](), loadSource(slug)]);
  return { content: module.default, metadata: module.metadata, raw };
}
