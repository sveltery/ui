<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '$registry/bases/base/ui/drawer';
</script>

<Drawer showSwipeHandle>
  <DrawerTrigger>
    {#snippet render(props, _state, content)}<Button variant="secondary" {...props}>{@render content?.()}</Button>{/snippet}
    Open Drawer
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Drawer</DrawerTitle>
      <DrawerDescription>Drawer with a swipe handle.</DrawerDescription>
    </DrawerHeader>
    <div class="flex-1 p-4">
      <div class="rounded-2xl bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full"></div>
    </div>
    <DrawerFooter>
      <DrawerClose>
        {#snippet render(props, _state, content)}<Button {...props}>{@render content?.()}</Button>{/snippet}
        Close
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
