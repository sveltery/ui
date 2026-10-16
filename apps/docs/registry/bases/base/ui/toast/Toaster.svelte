<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Toast as Primitive } from '@sveltery/base/toast';
  import { toast } from './toast.js';
  import ToastList from './ToastList.svelte';
  import ToastPortal from './ToastPortal.svelte';
  import ToastViewport from './ToastViewport.svelte';
  let { children, toastManager = toast, ...props }: ComponentProps<typeof Primitive.Provider> = $props();
</script>
<Primitive.Provider {toastManager} {...props}>
  {@render children?.()}
  <ToastPortal>
    <ToastViewport>
      <ToastList />
    </ToastViewport>
  </ToastPortal>
</Primitive.Provider>
