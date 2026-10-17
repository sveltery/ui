<script lang="ts">
  import { useAppDispatch } from './hooks.svelte.js';
  import { useRegistration } from './registration.svelte.js';
  import { addPolarGraphicalItem, removePolarGraphicalItem, replacePolarGraphicalItem, type PolarGraphicalItemSettings } from './graphicalItemsSlice.js';

  let props: PolarGraphicalItemSettings = $props();
  const dispatch = useAppDispatch();
  useRegistration<PolarGraphicalItemSettings>(() => ({ ...props }), {
    add: (settings) => dispatch(addPolarGraphicalItem(settings)),
    replace: (prev, next) => dispatch(replacePolarGraphicalItem({ prev, next })),
    remove: (settings) => dispatch(removePolarGraphicalItem(settings)),
  });
</script>
