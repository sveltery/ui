<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { HTMLLabelAttributes } from 'svelte/elements';
  import { Field as Primitive } from '@sveltery/base/field';
  import { cn } from 'cn';
  import { inField } from './context.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Label> & Pick<HTMLLabelAttributes, 'for'> = $props();
  const className = $derived(cn('cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed', 'cn-field-label group/field-label peer/field-label flex w-fit', 'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col', classProp));
</script>
{#if inField()}
  <Primitive.Label data-slot="field-label" {children} {...props} class={className} />
{:else}
  <label data-slot="field-label" {...props} class={className}>{@render children?.()}</label>
{/if}
