import { getContext, setContext } from 'svelte';
export const iconLibraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export type IconLibraryName = typeof iconLibraries[number];
const context = Symbol('example icon library');
export function setIconLibraryContext(getLibrary: () => IconLibraryName) { setContext(context, getLibrary); }
export function getIconLibraryContext(): () => IconLibraryName { return getContext(context) ?? (() => 'lucide'); }
