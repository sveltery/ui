<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { AlertDialog as Primitive } from '@sveltery/base/alert-dialog';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Backdrop> = $props();
</script>
<Primitive.Backdrop data-slot="alert-dialog-overlay" {children} {...props} class={cn('cn-alert-dialog-overlay fixed inset-0 isolate z-50', classProp)} />
