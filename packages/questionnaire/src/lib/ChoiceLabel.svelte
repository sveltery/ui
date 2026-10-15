<script lang="ts">
  import { getChoice } from './item-state.svelte.js';
  import type { QuestionnaireChoiceLabelProps } from './types.js';

  let { render, children, ...rest }: QuestionnaireChoiceLabelProps = $props();
  getChoice();
</script>

{#if render}
  {@render render(rest, {}, children)}
{:else}
  <span {...rest}>{@render children?.()}</span>
{/if}
