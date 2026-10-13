<script lang="ts">
  import { getCommand } from './root.svelte.js';
  import type { CommandSeparatorProps } from './types.js';

  let { alwaysRender = false, ...rest }: CommandSeparatorProps = $props();

  const root = getCommand();
</script>

{#if alwaysRender || !root.search}
  <div {...rest} cmdk-separator="" role="separator"></div>
{/if}
