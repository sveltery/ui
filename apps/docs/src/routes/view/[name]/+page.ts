import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import { blocks } from '#blocks/registry';
import type { EntryGenerator, PageLoad } from './$types';

const pages = import.meta.glob<{ default: Component }>('/blocks/*/page.svelte');

export const prerender = true;

export const entries: EntryGenerator = () => blocks.map(({ name }) => ({ name }));

export const load: PageLoad = async ({ params }) => {
  const block = blocks.find(({ name }) => name === params.name);
  const page = pages[`/blocks/${params.name}/page.svelte`];
  if (!block || !page) error(404, 'Not found');
  return { block, component: (await page()).default };
};
