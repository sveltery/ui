import { createContext } from 'svelte';
import type { Box } from '../state/hooks.svelte.js';
import type { Size } from '../util/types.js';
import { defaultResponsiveContainerProps } from './responsiveContainerUtils.js';

export const [getResponsiveContainerContext, setResponsiveContainerContext, hasResponsiveContainerContext] = createContext<Box<Size>>();

const outsideContainer: Box<Size> = { current: defaultResponsiveContainerProps.initialDimension };

/** Must be called during component initialisation. Outside a ResponsiveContainer it reads the -1 by -1 initial dimension. */
export const useResponsiveContainerContext = (): Box<Size> => (hasResponsiveContainerContext() ? getResponsiveContainerContext() : outsideContainer);
