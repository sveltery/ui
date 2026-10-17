<script lang="ts">
  import type { LayoutType, Margin } from '../util/types.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import { useAppDispatch } from './hooks.svelte.js';
  import { toStoreValue } from './toStoreValue.js';
  import { setLayout, setMargin } from './layoutSlice.js';

  let { layout, margin }: { layout: LayoutType; margin: Partial<Margin> } = $props();
  const dispatch = useAppDispatch();
  // A panorama chart leaves these to the root chart; Brush reads them, so they must stay stable.
  const isPanorama = useIsPanorama();
  $effect(() => {
    if (!isPanorama) {
      dispatch(setLayout(layout));
      dispatch(setMargin(toStoreValue(margin)));
    }
  });
</script>
