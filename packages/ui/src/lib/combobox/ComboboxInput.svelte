<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../input-group/index.js';
  import ComboboxClear from './ComboboxClear.svelte';
  import ComboboxTrigger from './ComboboxTrigger.svelte';
  let {
    children,
    class: classProp,
    disabled = false,
    showTrigger = true,
    showClear = false,
    ...props
  }: Omit<ComponentProps<typeof Primitive.Input>, 'children'> & { children?: Snippet; showTrigger?: boolean; showClear?: boolean } = $props();
</script>

<InputGroup class={cn('cn-combobox-input w-auto', classProp)}>
  <Primitive.Input {disabled} {...props}>
    {#snippet render(hostProps)}
      <InputGroupInput {...hostProps} />
    {/snippet}
  </Primitive.Input>
  <InputGroupAddon align="inline-end">
    {#if showTrigger}
      <ComboboxTrigger {disabled} data-slot="input-group-button" class="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent">
        {#snippet render(hostProps, _state, content)}
          <InputGroupButton size="icon-xs" variant="ghost" {...hostProps}>
            {@render content?.()}
          </InputGroupButton>
        {/snippet}
      </ComboboxTrigger>
    {/if}
    {#if showClear}
      <ComboboxClear {disabled} />
    {/if}
  </InputGroupAddon>
  {@render children?.()}
</InputGroup>
