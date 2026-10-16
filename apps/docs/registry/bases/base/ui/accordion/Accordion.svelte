<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Accordion as Primitive } from '@sveltery/base/accordion';
  import { cn } from 'cn';
  let { value = $bindable(), children, class: classProp, ...props }: ComponentProps<typeof Primitive.Root> = $props();
</script>
<Primitive.Root data-slot="accordion" bind:value {...props} class={cn('cn-accordion flex w-full flex-col', classProp)}>
  {@render children?.()}
</Primitive.Root>
