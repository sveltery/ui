<script lang="ts">
  import { getItem } from './item.svelte.js';
  import type { QuestionnaireChoicesProps } from './types.js';
  import { dataAttributes } from './utils.js';

  let { render, children, ...rest }: QuestionnaireChoicesProps = $props();
  const item = getItem();
  const state = $derived({ shortcuts: item.root.shortcuts });
  const attributes = $derived({ ...dataAttributes(state), ...rest });
</script>

{#if render}
  {@render render(attributes, state, children)}
{:else}
  <div {...attributes}>{@render children?.()}</div>
{/if}
