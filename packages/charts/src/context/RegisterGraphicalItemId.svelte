<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { GraphicalItemId } from '../state/graphicalItemsSlice.js';
  import { setGraphicalItemIdContext } from './RegisterGraphicalItemId.hooks.js';

  let { id, type, children }: { id?: string; type: string; children: Snippet<[GraphicalItemId]> } = $props();
  const generatedId = $props.id();
  const resolvedId = $derived(id ? id : `recharts-${type}-${generatedId}`);
  setGraphicalItemIdContext({
    get current() {
      return resolvedId;
    },
  });
</script>

{@render children(resolvedId)}
