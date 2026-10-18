import { createContext } from 'svelte';

export const [getClipPathIdContext, setClipPathIdContext, hasClipPathIdContext] = createContext<string>();

/** Must be called during component initialisation. */
export const useClipPathId = (): string | undefined => (hasClipPathIdContext() ? getClipPathIdContext() : undefined);
