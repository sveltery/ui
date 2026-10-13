<script lang="ts">
  import { Toast } from '@sveltery/base/toast';
  import { cn } from 'cn';
  import type { ToasterProps } from './types.js';
  import ToasterList from './ToasterList.svelte';
  import { toastManager } from './toast.js';
  let { class: classProp, timeout = 4000, limit = 3, ...props }: ToasterProps = $props();
</script>
<Toast.Provider {toastManager} {timeout} {limit}>
  <Toast.Portal>
    <Toast.Viewport data-slot="toast-viewport" {...props} class={cn('toaster group pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full', classProp)}>
      <ToasterList />
    </Toast.Viewport>
  </Toast.Portal>
</Toast.Provider>
