import { createContext } from 'svelte';
import type { Box, Getter } from '../state/hooks.svelte.js';
import type { AnimationManager } from './AnimationManager.js';
import { createDefaultAnimationManager } from './createDefaultAnimationManager.js';

export type AnimationManagerFactory = (animationId: string) => AnimationManager;

export const [getAnimationManagerContext, setAnimationManagerContext, hasAnimationManagerContext] = createContext<AnimationManagerFactory>();

/** Must be called during component initialisation. A new manager is made when the animation id or the manager prop changes. */
export function useAnimationManager(animationId: Getter<string>, animationManagerFromProps: Getter<AnimationManager | undefined>): Box<AnimationManager> {
  const contextAnimationManager = hasAnimationManagerContext() ? getAnimationManagerContext() : createDefaultAnimationManager;
  const manager = $derived(animationManagerFromProps() ?? contextAnimationManager(animationId()));
  return {
    get current() {
      return manager;
    },
  };
}
