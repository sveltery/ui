<script lang="ts">
  import { Input as Primitive } from '@sveltery/base/input';
  import { cn } from 'cn';
  import type { HTMLAttributes, HTMLTextareaAttributes } from 'svelte/elements';
  import { inField } from '../field/context.js';
  import type { TextareaProps } from './types.js';
  let { class: classProp, value = $bindable(), ...props }: TextareaProps = $props();
  // A bound remote field's spread carries the input's `type`, which a textarea has no use for.
  function withoutType(control: HTMLAttributes<HTMLElement>) {
    const rest: Record<string, unknown> = { ...control };
    delete rest.type;
    return rest as HTMLTextareaAttributes;
  }
  const className = $derived(cn('cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', classProp));
</script>
{#if inField()}
  <!-- Base labels, describes and validates its control, so a Field renders the textarea through it. -->
  <Primitive {...props as Record<string, unknown>} bind:value>
    {#snippet render(control)}
      <textarea data-slot="textarea" {...withoutType(control)} class={className}></textarea>
    {/snippet}
  </Primitive>
{:else}
  <textarea data-slot="textarea" {...props} class={className} bind:value></textarea>
{/if}
