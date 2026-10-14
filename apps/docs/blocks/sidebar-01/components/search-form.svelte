<script lang="ts">
  import type { HTMLFormAttributes } from 'svelte/elements';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Label } from '@sveltery/ui/label';
  import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@sveltery/ui/sidebar';

  let { ...props }: HTMLFormAttributes = $props();
</script>

<form {...props}>
  <SidebarGroup class="py-0">
    <SidebarGroupContent class="relative">
      <Label for="search" class="sr-only">Search</Label>
      <SidebarInput id="search" placeholder="Search the docs..." class="pl-8" />
      <IconPlaceholder
        lucide="SearchIcon"
        tabler="IconSearch"
        hugeicons="SearchIcon"
        phosphor="MagnifyingGlassIcon"
        remixicon="RiSearchLine"
        class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
      />
    </SidebarGroupContent>
  </SidebarGroup>
</form>
