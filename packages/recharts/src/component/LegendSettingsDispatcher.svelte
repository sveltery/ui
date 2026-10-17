<script lang="ts">
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { setLegendSettings, type LegendSettings } from '../state/legendSlice.js';

  let props: LegendSettings = $props();
  const dispatch = useAppDispatch();
  $effect(() => {
    dispatch(setLegendSettings({ ...props }));
  });
</script>
