<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Toast as Primitive } from '@sveltery/base/toast';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Content> = $props();
</script>
<Primitive.Content data-slot="toast-content" {...props} {children} class={cn('flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100', classProp)} />
