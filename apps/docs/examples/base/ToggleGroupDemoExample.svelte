<script lang="ts">
  import Bold from '@lucide/svelte/icons/bold';
  import Italic from '@lucide/svelte/icons/italic';
  import Underline from '@lucide/svelte/icons/underline';
  import { ToggleGroup, ToggleGroupItem } from '$registry/bases/base/ui/toggle-group';
</script>

<ToggleGroup variant="outline" multiple>
  <ToggleGroupItem value="bold" aria-label="Toggle bold">
    <Bold />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">
    <Italic />
  </ToggleGroupItem>
  <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
    <Underline />
  </ToggleGroupItem>
</ToggleGroup>
