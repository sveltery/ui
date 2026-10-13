<script lang="ts">
  import { createAttachmentKey } from 'svelte/attachments';
  import { getChoice } from './item.svelte.js';
  import type { QuestionnaireChoiceInputProps, QuestionnaireChoiceState } from './types.js';
  import { dataAttributes, getAnswerKeyShortcuts } from './utils.js';

  let { render, onchange, ...rest }: QuestionnaireChoiceInputProps = $props();

  const choice = getChoice();
  const item = choice.item;
  item.register(choice);
  $effect(() => () => item.unregister(choice));

  const attachment = createAttachmentKey();
  const state: QuestionnaireChoiceState = $derived({
    checked: choice.checked,
    disabled: choice.disabled,
    invalid: item.invalid,
    shortcut: choice.shortcut,
    type: choice.type
  });
  const attributes = $derived({
    'aria-invalid': item.invalid || undefined,
    'aria-keyshortcuts': getAnswerKeyShortcuts(choice.shortcut, !choice.disabled && choice.checked),
    checked: choice.checked,
    defaultChecked: choice.default,
    disabled: choice.disabled,
    id: choice.id,
    name: item.status === 'skipped' ? undefined : item.name,
    required: item.required && !item.multiple && !item.hasInputAnswer,
    type: choice.type,
    value: choice.value,
    ...dataAttributes(state, { checked: ['checked', 'unchecked'] }),
    ...rest,
    onchange: (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
      onchange?.(event);
      choice.change(event);
    },
    [attachment]: choice.attach
  });
</script>

{#if render}
  {@render render(attributes, state)}
{:else}
  <input {...attributes} />
{/if}
