import { markdownResponse } from '$lib/docs/llm.server';

export const prerender = true;

export const GET = () => markdownResponse('');
