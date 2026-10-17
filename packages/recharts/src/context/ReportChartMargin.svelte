<script lang="ts">
  import type { Margin } from '../util/types.js';
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { setMargin } from '../state/layoutSlice.js';
  import { toStoreValue } from '../state/toStoreValue.js';

  let { margin }: { margin: Partial<Margin> } = $props();
  const dispatch = useAppDispatch();
  $effect(() => {
    dispatch(setMargin(toStoreValue(margin)));
  });
</script>
