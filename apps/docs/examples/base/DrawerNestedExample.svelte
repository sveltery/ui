<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { Button } from '$registry/bases/base/ui/button';
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '$registry/bases/base/ui/drawer';

  const isMobile = new MediaQuery('max-width: 767px');
  const swipeDirection = $derived(isMobile.current ? 'down' : 'right');
</script>

<Drawer showSwipeHandle={isMobile.current} {swipeDirection}>
  <DrawerTrigger>
    {#snippet render(props, _state, content)}<Button variant="secondary" {...props}>{@render content?.()}</Button>{/snippet}
    Open Drawer
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Drawer</DrawerTitle>
      <DrawerDescription>Open another drawer from the same direction.</DrawerDescription>
    </DrawerHeader>
    <div class="flex-1 p-4">
      <div class="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full"></div>
    </div>
    <DrawerFooter>
      <Drawer showSwipeHandle={isMobile.current} {swipeDirection}>
        <DrawerTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Open Nested Drawer
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Nested Drawer</DrawerTitle>
            <DrawerDescription>The parent drawer stays mounted behind this one.</DrawerDescription>
          </DrawerHeader>
          <div class="flex-1 p-4">
            <div class="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full"></div>
          </div>
          <DrawerFooter>
            <Drawer showSwipeHandle={isMobile.current} {swipeDirection}>
              <DrawerTrigger>
                {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
                Open Third Drawer
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Third Drawer</DrawerTitle>
                  <DrawerDescription>Two drawers are stacked behind this one.</DrawerDescription>
                </DrawerHeader>
                <div class="flex-1 p-4">
                  <div class="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full"></div>
                </div>
                <DrawerFooter>
                  <Drawer showSwipeHandle={isMobile.current} {swipeDirection}>
                    <DrawerTrigger>
                      {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
                      Open Fourth Drawer
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Fourth Drawer</DrawerTitle>
                        <DrawerDescription>This is the frontmost drawer in the stack.</DrawerDescription>
                      </DrawerHeader>
                      <div class="flex-1 p-4">
                        <div class="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full"></div>
                      </div>
                      <DrawerFooter>
                        <DrawerClose>
                          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
                          Close
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                  <DrawerClose>
                    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
                    Close
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <DrawerClose>
              {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <DrawerClose>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Close
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
