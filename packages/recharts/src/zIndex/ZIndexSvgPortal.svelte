<svelte:options namespace="svg" />

<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { registerZIndexPortalElement, unregisterZIndexPortalElement } from '../state/zIndexSlice.js';

  let { zIndex, isPanorama }: { zIndex: number; isPanorama: boolean } = $props();
  const dispatch = useAppDispatch();

  // Upstream registers from a ref in useLayoutEffect; an attachment re-runs on the same inputs, zIndex and isPanorama.
  const registerElement: Attachment<SVGGElement> = (element) => {
    const registered = { zIndex, isPanorama };
    dispatch(registerZIndexPortalElement({ ...registered, element }));
    return () => {
      dispatch(unregisterZIndexPortalElement(registered));
    };
  };
</script>

<g tabindex="-1" {@attach registerElement} class="recharts-zIndex-layer_{zIndex}"></g>
