<script lang="ts">
  import Anchor from './Anchor.svelte';
  import { usePart, type Part } from './parts.svelte.js';
  import { getCommand } from './root-state.svelte.js';
  import type { CommandLoadingProps } from './types.js';

  let { progress, label = 'Loading...', children, ...rest }: CommandLoadingProps = $props();

  const anchor = $props.id();
  const root = getCommand();
  const part: Part = { anchor, sequence: root.sequence(), kind: 'other', view };
  const container = usePart(root, part);
</script>

{#snippet view()}
  <div {...rest} cmdk-loading="" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
    <div aria-hidden="true">{@render children?.()}</div>
  </div>
{/snippet}

<Anchor part={part} />{#if !container}{@render view()}{/if}
