<script lang="ts" generics="Payload = unknown">
  import { Drawer as Primitive, type DrawerRootProps } from '@sveltery/base/drawer';
  import { setDrawerContext } from './context.js';
  let { open = $bindable(), snapPoint = $bindable(), triggerId = $bindable(), modal = true, showSwipeHandle = false, snapPoints, swipeDirection = 'down', ...props }: DrawerRootProps<Payload> & { showSwipeHandle?: boolean } = $props();

  setDrawerContext({
    get hasSnapPoints() { return snapPoints != null && snapPoints.length > 0; },
    get modal() { return modal; },
    get showSwipeHandle() { return showSwipeHandle; },
    get swipeDirection() { return swipeDirection; },
  });
</script>
<Primitive.Root bind:open bind:snapPoint bind:triggerId {modal} {snapPoints} {swipeDirection} {...props} />
