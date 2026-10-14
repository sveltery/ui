<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Toast as Primitive } from '@sveltery/base/toast';
  import { cn } from 'cn';
  import { buttonVariants } from '../button/index.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Action> = $props();
</script>
<Primitive.Action data-slot="toast-action" {...props} {children} class={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'shrink-0', classProp)} />
