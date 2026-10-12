<script lang="ts">
  import * as UI from '$ui/popover/index.js';
  let { side = undefined, align = undefined, events = [] }: { side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end'; align?: 'start' | 'center' | 'end'; events?: string[] } = $props();
  let open = $state(false);
  export function isOpen() { return open; }
  export function setOpen(next: boolean) { open = next; }
</script>
<UI.Popover bind:open onOpenChange={(next, details) => events.push(`change:${next}:${details.reason}`)}>
  <UI.PopoverTrigger>Open</UI.PopoverTrigger>
  <UI.PopoverContent class="w-40" {side} {align}>
    <UI.PopoverHeader class="extra-header">
      <UI.PopoverTitle>Dimensions</UI.PopoverTitle>
      <UI.PopoverDescription>Set the dimensions for the layer.</UI.PopoverDescription>
    </UI.PopoverHeader>
  </UI.PopoverContent>
</UI.Popover>
