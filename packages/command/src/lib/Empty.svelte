<script lang="ts">
  import Anchor from './Anchor.svelte';
  import { usePart, type Part } from './parts.svelte.js';
  import { getCommand } from './root-state.svelte.js';
  import type { CommandEmptyProps } from './types.js';

  let { children, ...rest }: CommandEmptyProps = $props();

  const anchor = $props.id();
  const root = getCommand();
  const part: Part = { anchor, sequence: root.sequence(), kind: 'other', view };
  const container = usePart(root, part);
</script>

{#snippet view()}
  {#if root.count === 0}<div {...rest} cmdk-empty="" role="presentation">{@render children?.()}</div>{/if}
{/snippet}

<Anchor part={part} />{#if !container}{@render view()}{/if}
