<script lang="ts">
  import { Input as Primitive } from '@sveltery/base/input';
  import type { InputProps } from '@sveltery/base/input';
  import { cn } from 'cn';
  import type { HTMLAttributes, HTMLTextareaAttributes } from 'svelte/elements';
  import type { TextareaProps } from './types.js';
  let { class: classProp, value = $bindable(), ...props }: TextareaProps = $props();
  // A bound remote field's spread carries the input's `type`, which a textarea has no use for.
  // The server renders a spread `value` as an attribute, so `value` goes on the textarea itself.
  function withoutTypeOrValue(control: HTMLAttributes<HTMLElement>) {
    const rest: Record<string, unknown> = { ...control };
    delete rest.type;
    delete rest.value;
    return rest as HTMLTextareaAttributes;
  }
</script>
<!-- Base labels, describes and validates its control, so the textarea renders through it. -->
<Primitive {...props as InputProps} bind:value>
  {#snippet render(control)}
    <textarea data-slot="textarea" {...withoutTypeOrValue(control)} value={(control as HTMLTextareaAttributes).value} class={cn('cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', classProp)}></textarea>
  {/snippet}
</Primitive>
