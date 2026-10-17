<script lang="ts">
  import Anchor from './Anchor.svelte';
  import { usePart, type Part } from './parts.svelte.js';
  import { getCommand } from './root-state.svelte.js';
  import type { CommandSeparatorProps } from './types.js';

  let { alwaysRender = false, ...rest }: CommandSeparatorProps = $props();

  const anchor = $props.id();
  const root = getCommand();
  const part: Part = { anchor, sequence: root.sequence(), kind: 'other', view };
  const container = usePart(root, part);
</script>

{#snippet view()}
  {#if alwaysRender || !root.search}<div {...rest} cmdk-separator="" role="separator"></div>{/if}
{/snippet}

<Anchor part={part} />{#if !container}{@render view()}{/if}
