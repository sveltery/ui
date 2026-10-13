<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { AlertDialog as Primitive } from '@sveltery/base/alert-dialog';
  import { cn } from 'cn';
  import { buttonVariants, type ButtonVariants } from '../button/index.js';
  let { children, class: classProp, variant = 'outline', size = 'default', ...props }: ComponentProps<typeof Primitive.Close> & ButtonVariants = $props();
</script>
<Primitive.Close data-slot="alert-dialog-cancel" {children} {...props} class={cn(buttonVariants({ variant, size }), 'cn-alert-dialog-cancel', classProp)} />
