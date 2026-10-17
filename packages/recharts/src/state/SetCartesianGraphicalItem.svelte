<script lang="ts" generics="T extends CartesianGraphicalItemSettings">
  import { useAppDispatch } from './hooks.svelte.js';
  import { useRegistration } from './registration.svelte.js';
  import { addCartesianGraphicalItem, removeCartesianGraphicalItem, replaceCartesianGraphicalItem, type CartesianGraphicalItemSettings } from './graphicalItemsSlice.js';

  let props: T = $props();
  const dispatch = useAppDispatch();
  useRegistration<T>(() => ({ ...props }), {
    add: (settings) => dispatch(addCartesianGraphicalItem(settings)),
    replace: (prev, next) => dispatch(replaceCartesianGraphicalItem({ prev, next })),
    remove: (settings) => dispatch(removeCartesianGraphicalItem(settings)),
  });
</script>
