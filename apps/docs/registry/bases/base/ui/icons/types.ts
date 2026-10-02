import type { Snippet } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';
import type { IconLibraryName } from './config.js';

export type IconPlaceholderProps = Record<IconLibraryName, string> & Omit<SVGAttributes<SVGSVGElement>, 'children'> & {
  children?: Snippet;
  ref?: SVGSVGElement | null;
  strokeWidth?: string | number | null;
};
export type IconLibraryProviderProps = { library?: IconLibraryName; children?: Snippet };
