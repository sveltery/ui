<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Toast as Primitive } from '@sveltery/base/toast';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Viewport> = $props();
</script>
<Primitive.Viewport data-slot="toast-viewport" {...props} {children} class={cn('pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full', classProp)} />
