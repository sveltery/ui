import { createContext } from 'svelte';

const [, setPanoramaContext, hasPanoramaContext] = createContext<true>();

/** Must be called during component initialisation. A chart is a panorama for its whole lifetime, so this is a plain boolean. */
export const useIsPanorama = (): boolean => hasPanoramaContext();

export const providePanoramaContext = (): void => {
  setPanoramaContext(true);
};
