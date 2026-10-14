<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import * as UI from '$ui/sheet/index.js';
  let { side, closeButton = true }: { side?: ComponentProps<typeof UI.SheetContent>['side']; closeButton?: boolean } = $props();
  let open = $state(false);
  export function isOpen() { return open; }
  export function setOpen(next: boolean) { open = next; }
</script>
<UI.Sheet bind:open>
  <UI.SheetTrigger>Open</UI.SheetTrigger>
  <UI.SheetContent {side} showCloseButton={closeButton}>
    <UI.SheetHeader>
      <UI.SheetTitle>Title</UI.SheetTitle>
      <UI.SheetDescription>Description</UI.SheetDescription>
    </UI.SheetHeader>
    <UI.SheetFooter>
      <UI.SheetClose>Cancel</UI.SheetClose>
    </UI.SheetFooter>
  </UI.SheetContent>
</UI.Sheet>
