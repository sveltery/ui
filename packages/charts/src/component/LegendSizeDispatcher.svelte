<script lang="ts">
  import type { Size } from '../util/types.js';
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { setLegendSize } from '../state/legendSlice.js';

  let props: Size = $props();
  const dispatch = useAppDispatch();
  $effect(() => {
    dispatch(setLegendSize({ ...props }));
    return () => {
      dispatch(setLegendSize({ width: 0, height: 0 }));
    };
  });
</script>
