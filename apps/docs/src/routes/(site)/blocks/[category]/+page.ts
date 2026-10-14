import { error } from '@sveltejs/kit';
import { blocksIn, categories } from '#blocks/registry';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => categories.filter(({ slug }) => blocksIn(slug).length).map(({ slug }) => ({ category: slug }));

export const load: PageLoad = ({ params }) => {
  const category = categories.find(({ slug }) => slug === params.category);
  if (!category) error(404, 'Not found');
  return { category: category.name, blocks: blocksIn(category.slug) };
};
