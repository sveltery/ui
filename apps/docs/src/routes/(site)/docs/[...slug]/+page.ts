import { error } from '@sveltejs/kit';
import type { DocModule } from '$lib/docs/types';
import type { EntryGenerator, PageLoad } from './$types';

const modules = import.meta.glob<DocModule>(['/content/docs/**/*.md', '!**/README.md']);

const file = (slug: string) => [`/content/docs/${slug}.md`, `/content/docs/${slug ? `${slug}/` : ''}index.md`].find((path) => path in modules);

export const entries: EntryGenerator = () =>
  Object.keys(modules).map((path) => ({ slug: path.replace(/^\/content\/docs\//, '').replace(/\.md$/, '').replace(/(^|\/)index$/, '') }));

export const load: PageLoad = async ({ params }) => {
  const path = file(params.slug);
  if (!path) error(404, 'Page not found');
  const module = await modules[path]();
  return { content: module.default, metadata: module.metadata };
};
