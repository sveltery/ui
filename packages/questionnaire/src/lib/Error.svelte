<script lang="ts">
  import { getItem } from './item-state.svelte.js';
  import type { QuestionnaireErrorProps } from './types.js';
  import { dataAttributes } from './utils.js';

  const generatedId = $props.id();
  let { id: idProp, render, children, ...rest }: QuestionnaireErrorProps = $props();
  const item = getItem();
  const id = $derived(idProp ?? generatedId);
  $effect(() => item.explain(id));

  const state = $derived({ invalid: item.invalid });
  const attributes = $derived({ hidden: !state.invalid, id, role: state.invalid ? 'alert' : undefined, ...dataAttributes(state), ...rest });
</script>

{#snippet fallback()}{item.message}{/snippet}
{#if render}
  {@render render(attributes, state, children ?? fallback)}
{:else}
  <p {...attributes}>{@render (children ?? fallback)()}</p>
{/if}
