import { loadDoc } from '$lib/docs/load';
import type { PageLoad } from './$types';

export const load: PageLoad = () => loadDoc('forms/form-actions');
