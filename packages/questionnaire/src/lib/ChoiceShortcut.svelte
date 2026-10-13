<script lang="ts">
  import { getChoice } from './item.svelte.js';
  import type { QuestionnaireChoiceShortcutProps } from './types.js';
  import { dataAttributes } from './utils.js';

  let { render, children, ...rest }: QuestionnaireChoiceShortcutProps = $props();
  const choice = getChoice();
  const state = $derived({ shortcut: choice.shortcut });
  const attributes = $derived({ 'aria-hidden': true, hidden: state.shortcut === null, ...dataAttributes(state), ...rest });
</script>

{#snippet fallback()}{state.shortcut}{/snippet}
{#if render}
  {@render render(attributes, state, children ?? fallback)}
{:else}
  <span {...attributes}>{@render (children ?? fallback)()}</span>
{/if}
