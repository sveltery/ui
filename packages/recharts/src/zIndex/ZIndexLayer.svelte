<script lang="ts">
  import type { Snippet } from 'svelte';
  import { useAppDispatch, useAppSelector } from '../state/hooks.svelte.js';
  import { registerZIndexPortal, unregisterZIndexPortal } from '../state/zIndexSlice.js';
  import { useIsInChartContext } from '../context/chartLayoutContext.svelte.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import Portal from '../util/Portal.svelte';
  import { selectZIndexPortalElement } from './zIndexSelectors.js';

  let { zIndex, children }: { zIndex: number | undefined; children?: Snippet } = $props();

  // Outside a chart there is no portal state, so the content renders in place.
  const isInChartContext = useIsInChartContext();
  // zIndex undefined or 0 is the default layer, which needs no portal.
  const shouldRenderInPortal = $derived(isInChartContext.current && zIndex !== undefined && zIndex !== 0);
  const isPanorama = useIsPanorama();
  const dispatch = useAppDispatch();

  $effect(() => {
    if (!shouldRenderInPortal || zIndex === undefined) return;
    const registered = zIndex;
    // Layers are dynamic, so the requested zIndex is registered for AllZIndexPortals to render.
    dispatch(registerZIndexPortal({ zIndex: registered }));
    return () => {
      dispatch(unregisterZIndexPortal({ zIndex: registered }));
    };
  });

  const portalElement = useAppSelector((state) => selectZIndexPortalElement(state, zIndex, isPanorama));
</script>

{#if !shouldRenderInPortal}
  {@render children?.()}
{:else if portalElement.current && children}
  <Portal target={portalElement.current}>{@render children()}</Portal>
{/if}
