<script lang="ts">
  import { useAppDispatch } from './hooks.svelte.js';
  import { toStoreValue } from './toStoreValue.js';
  import { updateOptions, type UpdatableChartOptions } from './rootPropsSlice.js';

  let props: UpdatableChartOptions = $props();
  const dispatch = useAppDispatch();
  $effect(() => {
    dispatch(updateOptions(toStoreValue({ ...props })));
  });
</script>
