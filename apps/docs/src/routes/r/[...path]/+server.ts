import { error, json } from '@sveltejs/kit';
import { registry } from '$lib/registry.server';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => [...registry.keys()].map((path) => ({ path }));

/** The component registry the `sveltery` CLI installs from. */
export const GET: RequestHandler = ({ params }) => {
  const value = registry.get(params.path);
  if (!value) error(404, 'Not found');
  return json(value);
};
