<script lang="ts">
  import type { EventThrottlingProps } from '../util/types.js';
  import { useAppDispatch } from './hooks.svelte.js';
  import { toStoreValue } from './toStoreValue.js';
  import { setEventSettings } from './eventSettingsSlice.js';

  let props: EventThrottlingProps = $props();
  const dispatch = useAppDispatch();
  $effect(() => {
    dispatch(setEventSettings(toStoreValue({ ...props })));
  });
</script>
