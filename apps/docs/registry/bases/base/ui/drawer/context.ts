import { createContext } from 'svelte';
import type { DrawerRootProps, DrawerSwipeDirection } from '@sveltery/base/drawer';

export type DrawerContextValue = {
  readonly hasSnapPoints: boolean;
  readonly modal: DrawerRootProps['modal'];
  readonly showSwipeHandle: boolean;
  readonly swipeDirection: DrawerSwipeDirection;
};

export const [useDrawer, setDrawerContext] = createContext<DrawerContextValue>();
