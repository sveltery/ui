<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  import { setGroup, type GroupModel } from './item-state.svelte.js';
  import { setContainer } from './parts.svelte.js';

  const props: { group: GroupModel; labelledby: string | undefined; children: Snippet | undefined } = $props();

  // A group renders its own items, so its model never changes for one instance.
  const group = untrack(() => props.group);
  setGroup(group);
  setContainer(group.items);
</script>

<div cmdk-group-items="" role="group" aria-labelledby={props.labelledby}>{@render props.children?.()}{#each group.items.parts as part (part)}{@render part.view()}{/each}</div>
