<script lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$ui/collapsible/index.js';
  let open = $state(false);
  export function isOpen() { return open; }
  export function setOpen(next: boolean) { open = next; }
</script>
<Collapsible bind:open class="root">
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent class="panel">Hidden text</CollapsibleContent>
</Collapsible>
