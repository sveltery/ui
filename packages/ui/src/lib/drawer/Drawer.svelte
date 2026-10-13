<script lang="ts">
  import { Drawer as Primitive } from '@sveltery/base/drawer';
  import { setDrawerContext } from './context.js';
  import type { DrawerProps } from './types.js';
  let { open = $bindable(), snapPoint = $bindable(), modal = true, showSwipeHandle = false, snapPoints, swipeDirection = 'down', ...props }: DrawerProps = $props();

  setDrawerContext({
    get hasSnapPoints() { return snapPoints != null && snapPoints.length > 0; },
    get modal() { return modal; },
    get showSwipeHandle() { return showSwipeHandle; },
    get swipeDirection() { return swipeDirection; },
  });
</script>
<Primitive.Root bind:open bind:snapPoint {modal} {snapPoints} {swipeDirection} {...props} />
