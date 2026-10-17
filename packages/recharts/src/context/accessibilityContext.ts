import type { Box } from '../state/hooks.svelte.js';
import { useAppSelector } from '../state/hooks.svelte.js';

export const useAccessibilityLayer = (): Box<boolean> => {
  const accessibilityLayer = useAppSelector((state) => state.rootProps.accessibilityLayer);
  return {
    get current() {
      return accessibilityLayer.current ?? true;
    },
  };
};
