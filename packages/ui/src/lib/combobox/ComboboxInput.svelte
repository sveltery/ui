<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  import { InputGroup, InputGroupAddon, InputGroupButton } from '../input-group/index.js';
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
      <input data-slot="input-group-control" {...hostProps as HTMLInputAttributes} class={cn('cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50', 'cn-input-group-input flex-1', hostProps.class)} />
    {/snippet}
  </Primitive.Input>
  <InputGroupAddon align="inline-end">
    {#if showTrigger}
      <ComboboxTrigger {disabled} data-slot="input-group-button" aria-invalid="false" class="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent">
        {#snippet render(hostProps, _state, content)}
          <InputGroupButton size="icon-xs" variant="ghost" {...hostProps as Record<string, unknown>}>
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
