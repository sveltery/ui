import type { Snippet } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';
import type { IconLibraryName } from './config.js';

export type IconPlaceholderProps = Record<IconLibraryName, string> & Omit<SVGAttributes<SVGSVGElement>, 'children'>;
export type IconLibraryProviderProps = { library?: IconLibraryName; children?: Snippet };
