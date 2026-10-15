<script lang="ts">
  import { getCommand } from './root-state.svelte.js';
  import type { CommandEmptyProps } from './types.js';

  let { children, ...rest }: CommandEmptyProps = $props();

  const root = getCommand();
</script>

{#if root.count === 0}
  <div {...rest} cmdk-empty="" role="presentation">{@render children?.()}</div>
{/if}
