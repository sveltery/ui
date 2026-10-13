<script lang="ts">
  import { actions, getRoot, type ActionName } from './root.svelte.js';
  import type { QuestionnaireNavigationProps, QuestionnaireNavigationState } from './types.js';
  import { dataAttributes } from './utils.js';

  let { action: name, disabled = false, onclick, tabindex, type, render, children, ...rest }: QuestionnaireNavigationProps & { action: ActionName } = $props();

  const root = getRoot();
  const action = $derived(actions[name]);
  const visible = $derived(action.visible(root));
  const state: QuestionnaireNavigationState = $derived({
    disabled: Boolean(disabled),
    shortcut: visible && !disabled ? action.shortcut : null,
    status: root.activeStatus,
    visible
  });
  const attributes = $derived({
    'aria-hidden': !visible || undefined,
    'aria-keyshortcuts': state.shortcut ?? undefined,
    disabled,
    hidden: !visible,
    inert: !visible,
    tabindex: visible ? tabindex : -1,
    type: type ?? action.type,
    ...dataAttributes(state, { visible: ['visible', 'hidden'] }),
    ...rest,
    onclick: (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
      onclick?.(event);
      if (!event.defaultPrevented) action.run?.(root);
    }
  });
</script>

{#snippet fallback()}{action.label}{/snippet}
{#if render}
  {@render render(attributes, state, children ?? fallback)}
{:else}
  <button {...attributes}>{@render (children ?? fallback)()}</button>
{/if}
