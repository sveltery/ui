import { loadDoc } from '$lib/docs/load';
import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = ({ params }) => loadDoc(params.slug);
