import { createContext } from 'svelte';
import type { Box } from '../state/hooks.svelte.js';

export const [getTooltipPortalContext, setTooltipPortalContext, hasTooltipPortalContext] = createContext<Box<HTMLElement | null>>();

const noPortal: Box<null> = { current: null };

/** Must be called during component initialisation. */
export const useTooltipPortal = (): Box<HTMLElement | null> => (hasTooltipPortalContext() ? getTooltipPortalContext() : noPortal);
