<script lang="ts">
  import BoldIcon from '@lucide/svelte/icons/bold';
  import ItalicIcon from '@lucide/svelte/icons/italic';
  import { Toggle } from '$registry/bases/base/ui/toggle';
</script>

<div class="flex flex-wrap items-center gap-2">
  <Toggle variant="outline" aria-label="Toggle italic">
    <ItalicIcon />
    Italic
  </Toggle>
  <Toggle variant="outline" aria-label="Toggle bold">
    <BoldIcon />
    Bold
  </Toggle>
</div>
