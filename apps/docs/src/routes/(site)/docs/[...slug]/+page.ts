import { loadDoc, slugs } from '$lib/docs/load';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => slugs().map((slug) => ({ slug }));

export const load: PageLoad = ({ params }) => loadDoc(params.slug);
