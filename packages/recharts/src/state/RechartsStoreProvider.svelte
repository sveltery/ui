<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  import type { RechartsRootState } from './store.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import { createRechartsReduxContextValue, setRechartsReduxContext } from './RechartsReduxContext.js';

  let { preloadedState, children, reduxStoreName }: { children: Snippet; preloadedState?: Partial<RechartsRootState>; reduxStoreName?: string } = $props();

  // A panorama chart (the preview inside Brush) has no store of its own and reads the root chart's.
  // The store is created once, like upstream's ref, so later prop values do not replace it.
  if (!useIsPanorama()) {
    setRechartsReduxContext(untrack(() => createRechartsReduxContextValue(preloadedState, reduxStoreName)));
  }
</script>

{@render children()}
