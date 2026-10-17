import { createContext } from 'svelte';
import type { Box } from '../state/hooks.svelte.js';

export const [getLegendPortalContext, setLegendPortalContext, hasLegendPortalContext] = createContext<Box<HTMLElement | null>>();

const noPortal: Box<null> = { current: null };

/** Must be called during component initialisation. */
export const useLegendPortal = (): Box<HTMLElement | null> => (hasLegendPortalContext() ? getLegendPortalContext() : noPortal);
