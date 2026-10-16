<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Popover as Primitive } from '@sveltery/base/popover';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Description> = $props();
</script>
<Primitive.Description data-slot="popover-description" {children} {...props} class={cn('cn-popover-description', classProp)} />
