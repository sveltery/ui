<script lang="ts">
  import { Toast } from '@sveltery/base/toast';
  import { cn } from 'cn';
  import type { ToasterProps, ToastPosition } from './types.js';
  import ToasterList from './ToasterList.svelte';
  import { toastManager } from './toast.js';
  let { class: classProp, timeout = 4000, limit = 3, position = 'bottom-right', richColors = false, closeButton = false, closeButtonAriaLabel = 'Close toast', classNames, ...props }: ToasterProps = $props();

  const placement: Record<ToastPosition, string> = {
    'top-left': 'top-4 sm:right-auto sm:left-4 sm:mx-0 sm:w-full',
    'top-center': 'top-4',
    'top-right': 'top-4 sm:right-4 sm:left-auto sm:mx-0 sm:w-full',
    'bottom-left': 'bottom-4 sm:right-auto sm:left-4 sm:mx-0 sm:w-full',
    'bottom-center': 'bottom-4',
    'bottom-right': 'bottom-4 sm:right-4 sm:left-auto sm:mx-0 sm:w-full'
  };
</script>
<Toast.Provider {toastManager} {timeout} {limit}>
  <Toast.Portal>
    <Toast.Viewport data-slot="toast-viewport" data-position={position} {...props} class={cn('toaster group pointer-events-none fixed inset-x-4 z-50 mx-auto w-auto max-w-sm outline-none', placement[position], classProp)}>
      <ToasterList {position} {richColors} {closeButton} {closeButtonAriaLabel} {classNames} />
    </Toast.Viewport>
  </Toast.Portal>
</Toast.Provider>
