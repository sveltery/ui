<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Tabs, TabsList, TabsTrigger } from '@sveltery/ui/tabs';

  // Holds two `<InstallTab>` panels, `cli` and `manual`, like upstream's Installation tabs.
  let { children }: { children: Snippet } = $props();
</script>

<Tabs value="cli" class="mt-6 w-full gap-0">
  <TabsList variant="line" data-not-typeset class="w-full justify-start gap-4 rounded-none border-b p-0">
    <TabsTrigger value="cli" class="h-9 flex-none px-0 text-base">CLI</TabsTrigger>
    <TabsTrigger value="manual" class="h-9 flex-none px-0 text-base">Manual</TabsTrigger>
  </TabsList>
  {@render children()}
</Tabs>
