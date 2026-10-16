import { error } from '@sveltejs/kit';
import type { DocModule } from './types';

const modules = import.meta.glob<DocModule>(['/content/docs/**/*.md', '!**/README.md']);

/** Pages with their own route, such as a page whose demo posts to a form action, which cannot be prerendered. */
const routed = ['forms/form-actions'];

const file = (slug: string) => [`/content/docs/${slug}.md`, `/content/docs/${slug ? `${slug}/` : ''}index.md`].find((path) => path in modules);

export const slugs = () =>
  Object.keys(modules)
    .map((path) => path.replace(/^\/content\/docs\//, '').replace(/\.md$/, '').replace(/(^|\/)index$/, ''))
    .filter((slug) => !routed.includes(slug));

export async function loadDoc(slug: string) {
  const path = file(slug);
  if (!path) error(404, 'Page not found');
  const module = await modules[path]();
  return { content: module.default, metadata: module.metadata };
}

export async function docStyle(slug: string) {
  const path = file(slug);
  return path ? (await modules[path]()).metadata.style : undefined;
}
