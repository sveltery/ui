<script lang="ts">
  import BoldIcon from '@lucide/svelte/icons/bold';
  import ItalicIcon from '@lucide/svelte/icons/italic';
  import UnderlineIcon from '@lucide/svelte/icons/underline';
  import { ToggleGroup, ToggleGroupItem } from '$registry/bases/base/ui/toggle-group';
</script>

<ToggleGroup multiple orientation="vertical" spacing={1} value={['bold', 'italic']}>
  <ToggleGroupItem value="bold" aria-label="Toggle bold">
    <BoldIcon />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">
    <ItalicIcon />
  </ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Toggle underline">
    <UnderlineIcon />
  </ToggleGroupItem>
</ToggleGroup>
