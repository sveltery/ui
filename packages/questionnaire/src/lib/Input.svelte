<script lang="ts">
  import { untrack } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { getItem, InputModel } from './item.svelte.js';
  import type { QuestionnaireInputProps, QuestionnaireInputState } from './types.js';
  import { dataAttributes, getAnswerKeyShortcuts } from './utils.js';

  const id = $props.id();
  let { value = $bindable(), defaultValue, type = 'text', disabled = false, oninput, render, ...rest }: QuestionnaireInputProps = $props();

  const item = getItem();
  value ??= untrack(() => defaultValue);
  const input = new InputModel(item, {
    get value() { return value; },
    set value(next) { value = next; },
    get defaultValue() { return defaultValue; },
    get disabled() { return disabled; }
  });
  item.register(input);
  $effect(() => () => item.unregister(input));

  const attachment = createAttachmentKey();
  const state: QuestionnaireInputState = $derived({ disabled: input.disabled, filled: input.filled, invalid: item.invalid });
  const attributes = $derived({
    'aria-invalid': item.invalid || undefined,
    'aria-keyshortcuts': getAnswerKeyShortcuts(null, !input.disabled && input.answered),
    value,
    defaultValue: input.default,
    disabled: input.disabled,
    form: input.selected ? undefined : '',
    id,
    name: input.selected ? item.name : undefined,
    type,
    ...dataAttributes(state, { filled: ['filled', 'empty'] }),
    ...rest,
    oninput: (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
      oninput?.(event);
      input.input(event.currentTarget);
    },
    [attachment]: input.attach
  });
</script>

{#if render}
  {@render render(attributes, state)}
{:else}
  <input {...attributes} />
{/if}
