<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Popover as Primitive } from '@sveltery/base/popover';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Title> = $props();
</script>
<Primitive.Title data-slot="popover-title" {children} {...props} class={cn('cn-popover-title', classProp)} />
