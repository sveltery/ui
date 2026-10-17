<script lang="ts">
  import type { Snippet } from 'svelte';
  import { TabsContent } from '$registry/bases/base/ui/tabs';

  let { value, children }: { value: 'cli' | 'manual'; children: Snippet } = $props();
</script>

<TabsContent {value} keepMounted class="pt-6">
  {@render children()}
</TabsContent>
