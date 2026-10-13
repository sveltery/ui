<script lang="ts">
  import { Field } from '@sveltery/base/field';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getItem } from './item.svelte.js';
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

{#snippet text(_: HTMLAttributes<HTMLElement>, __: unknown, message: Snippet | undefined)}{@render message?.()}{/snippet}
<!-- An invalid Field shows a Form error or source issue on the item's name, else the item's own message. -->
{#snippet fallback()}
  <Field.Validity>
    {#snippet children(field)}{#if field.validity.valid === false}<Field.Error render={text} />{:else}{item.message}{/if}{/snippet}
  </Field.Validity>
{/snippet}
{#if render}
  {@render render(attributes, state, children ?? fallback)}
{:else}
  <p {...attributes}>{@render (children ?? fallback)()}</p>
{/if}
