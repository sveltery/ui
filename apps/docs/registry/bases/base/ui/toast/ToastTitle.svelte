<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Toast as Primitive } from '@sveltery/base/toast';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Title> = $props();
</script>
<Primitive.Title data-slot="toast-title" {...props} {children} class={cn('text-sm font-medium', classProp)} />
