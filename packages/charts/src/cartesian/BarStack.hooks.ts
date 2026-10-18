import { createContext } from 'svelte';
import { getNormalizedStackId, type NormalizedStackId, type StackId } from '../util/ChartUtils.js';
import type { Box } from '../state/hooks.svelte.js';
import { getClipPathId, type BarStackSettings } from './BarStack.js';

export const [getBarStackContext, setBarStackContext, hasBarStackContext] = createContext<Box<BarStackSettings>>();

/** Must be called during component initialisation. stackId may arrive from props or from a BarStack around the Bar. */
export const useStackId = (childStackId: () => StackId | undefined): Box<NormalizedStackId | undefined> => {
  const stackSettings = hasBarStackContext() ? getBarStackContext() : undefined;
  return {
    get current() {
      if (stackSettings != null) {
        return stackSettings.current.stackId;
      }
      const stackId = childStackId();
      if (stackId == null) {
        return undefined;
      }
      return getNormalizedStackId(stackId);
    },
  };
};

/** Must be called during component initialisation. */
export const useBarStackClipPathUrl = (index: () => number): Box<string | undefined> => {
  const barStackContext = hasBarStackContext() ? getBarStackContext() : undefined;
  return {
    get current() {
      if (barStackContext == null) {
        return undefined;
      }
      const { stackId } = barStackContext.current;
      return `url(#${getClipPathId(stackId, index())})`;
    },
  };
};
