<script lang="ts">
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@sveltery/ui/drawer';
  let openedBy = $state<string | null>();
</script>
<div class="flex flex-wrap gap-2 p-8">
  <Drawer>
    <DrawerTrigger>Edit profile</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Edit profile</DrawerTitle>
        <DrawerDescription>Make changes to your profile here.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Drawer>
          <DrawerTrigger>Open nested drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Nested drawer</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>Close nested</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <DrawerClose>Close</DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  <Drawer swipeDirection="right">
    <DrawerTrigger>Open right</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Right drawer</DrawerTitle>
      </DrawerHeader>
    </DrawerContent>
  </Drawer>
  <Drawer modal={false} disablePointerDismissal swipeDirection="right">
    <DrawerTrigger>Open non-modal</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Non-modal drawer</DrawerTitle>
      </DrawerHeader>
      <DrawerFooter>
        <DrawerClose>Close</DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  <Drawer bind:triggerId={openedBy}>
    <DrawerTrigger id="first-trigger">Open from first</DrawerTrigger>
    <DrawerTrigger id="second-trigger">Open from second</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Shared drawer</DrawerTitle>
      </DrawerHeader>
    </DrawerContent>
  </Drawer>
  <output data-testid="opened-by">{openedBy ?? ''}</output>
</div>
