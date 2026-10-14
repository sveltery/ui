import { error, json } from '@sveltejs/kit';
import { blocks } from '#blocks/registry';
import { blockFiles } from '$lib/blocks/source.server';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => blocks.map(({ name }) => ({ name }));

/** A block's files for the Code view, fetched when the view first opens. */
export const GET: RequestHandler = async ({ params }) => {
  const block = blocks.find(({ name }) => name === params.name);
  if (!block) error(404, 'Not found');
  return json(await blockFiles(block));
};
