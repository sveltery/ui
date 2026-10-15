<script lang="ts">
  import { getItem } from './item-state.svelte.js';
  import type { QuestionnaireDescriptionProps } from './types.js';

  const generatedId = $props.id();
  let { id: idProp, render, children, ...rest }: QuestionnaireDescriptionProps = $props();
  const item = getItem();
  const id = $derived(idProp ?? generatedId);
  $effect(() => item.describe(id));
  const attributes = $derived({ id, ...rest });
</script>

{#if render}
  {@render render(attributes, {}, children)}
{:else}
  <p {...attributes}>{@render children?.()}</p>
{/if}
