<script lang="ts">
  import { useAppDispatch } from './hooks.svelte.js';
  import { updatePolarOptions, type PolarChartOptions } from './polarOptionsSlice.js';

  let props: PolarChartOptions = $props();
  const dispatch = useAppDispatch();
  $effect(() => {
    dispatch(updatePolarOptions({ ...props }));
  });
</script>
