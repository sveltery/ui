<script lang="ts">
  import type { HTMLFormAttributes } from 'svelte/elements';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Label } from '@sveltery/ui/label';
  import { SidebarInput } from '@sveltery/ui/sidebar';

  let { ...props }: HTMLFormAttributes = $props();
</script>

<form {...props}>
  <div class="relative">
    <Label for="search" class="sr-only">Search</Label>
    <SidebarInput id="search" placeholder="Type to search..." class="h-8 pl-7" />
    <IconPlaceholder lucide="SearchIcon" tabler="IconSearch" hugeicons="SearchIcon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
  </div>
</form>
