<script lang="ts">
  import { getToastManager } from './toast.js';
  import Toast from './Toast.svelte';
  import ToastAction from './ToastAction.svelte';
  import ToastClose from './ToastClose.svelte';
  import ToastContent from './ToastContent.svelte';
  import ToastDescription from './ToastDescription.svelte';
  import ToastIcon from './ToastIcon.svelte';
  import ToastTitle from './ToastTitle.svelte';
  const manager = getToastManager();
</script>
{#each manager.toasts as toastItem (toastItem.id)}
  <Toast toast={toastItem}>
    <ToastContent>
      <ToastIcon type={toastItem.type} />
      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <ToastTitle />
        <ToastDescription />
      </div>
      <ToastAction />
      <ToastClose />
    </ToastContent>
  </Toast>
{/each}
