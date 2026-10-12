<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Accordion as Primitive } from '@sveltery/base/accordion';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Item> = $props();
</script>
<Primitive.Item data-slot="accordion-item" {children} {...props} class={cn('cn-accordion-item', classProp)} />
