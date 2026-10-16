<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { AlertDialog as Primitive } from '@sveltery/base/alert-dialog';
  import { cn } from 'cn';
  import AlertDialogPortal from './AlertDialogPortal.svelte';
  import AlertDialogOverlay from './AlertDialogOverlay.svelte';
  let { children, class: classProp, size = 'default', ...props }: ComponentProps<typeof Primitive.Popup> & { size?: 'default' | 'sm' } = $props();
</script>
<AlertDialogPortal>
  <AlertDialogOverlay />
  <Primitive.Popup data-slot="alert-dialog-content" data-size={size} {children} {...props} class={cn('cn-alert-dialog-content group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none', classProp)} />
</AlertDialogPortal>
