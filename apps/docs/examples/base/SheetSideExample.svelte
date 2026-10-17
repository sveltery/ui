<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
  } from '$registry/bases/base/ui/sheet';

  const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const;
</script>

<div class="flex flex-wrap gap-2">
  {#each SHEET_SIDES as side (side)}
    <Sheet>
      <SheetTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" class="capitalize" {...props}>{@render content?.()}</Button>{/snippet}
        {side}
      </SheetTrigger>
      <SheetContent {side} class="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <div class="no-scrollbar overflow-y-auto px-4">
          {#each { length: 10 } as _, index (index)}
            <p class="mb-2 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          {/each}
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose>
            {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
            Cancel
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  {/each}
</div>
