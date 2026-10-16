import { markdownResponse } from '$lib/docs/llm.server';
import { allSlugs } from '$lib/docs/load';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => allSlugs().filter(Boolean).map((slug) => ({ slug }));

export const GET: RequestHandler = ({ params }) => markdownResponse(params.slug);
