import { error } from '@sveltejs/kit';
import { blockSources } from '$lib/blocks/source.server';
import { blocks, categories } from '$blocks/registry';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => categories.map(({ slug }) => ({ category: slug }));

export const load: PageServerLoad = async ({ params }) => {
  const category = categories.find(({ slug }) => slug === params.category);
  if (!category) error(404, 'Not found');
  const names = blocks.filter((block) => block.categories.some((slug) => slug === category.slug)).map((block) => block.name);
  return { category: category.name, blocks: await blockSources(names) };
};
