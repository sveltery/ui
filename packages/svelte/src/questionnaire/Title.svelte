<script lang="ts">
  import { getItem } from './item-state.svelte.js';
  import type { QuestionnaireTitleProps } from './types.js';

  let { render, children, ...rest }: QuestionnaireTitleProps = $props();
  getItem();
</script>

{#if render}
  {@render render(rest, {}, children)}
{:else}
  <legend {...rest}>{@render children?.()}</legend>
{/if}
