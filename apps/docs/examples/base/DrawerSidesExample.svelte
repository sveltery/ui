<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '$registry/bases/base/ui/drawer';
</script>

<Drawer swipeDirection="left">
  <DrawerTrigger>
    {#snippet render(props, _state, content)}<Button variant="secondary" {...props}>{@render content?.()}</Button>{/snippet}
    Open Left Drawer
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Move Goal</DrawerTitle>
      <DrawerDescription>Set your daily activity goal.</DrawerDescription>
    </DrawerHeader>
    <div class="flex-1 p-4">
      <div class="size-full rounded-2xl bg-muted"></div>
    </div>
    <DrawerFooter>
      <DrawerClose>
        {#snippet render(props, _state, content)}<Button {...props}>{@render content?.()}</Button>{/snippet}
        Close
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
