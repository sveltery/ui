import { error } from '@sveltejs/kit';
import { CONTENT_OPTIONS, FIXTURES } from '$lib/typeset/fixtures';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => CONTENT_OPTIONS.map(({ value }) => ({ name: value }));

export const load: PageLoad = ({ params }) => {
  const option = CONTENT_OPTIONS.find(({ value }) => value === params.name);
  if (!option) error(404, 'Not found');
  return { name: option.value, label: option.label, html: FIXTURES[option.value] };
};
