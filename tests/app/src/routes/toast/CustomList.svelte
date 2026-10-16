<script lang="ts">
  import { Toast, ToastClose, ToastContent, ToastDescription, ToastPortal, ToastTitle, ToastViewport, getToastManager } from '$registry/bases/base/ui/toast';

  const manager = getToastManager();
</script>

<ToastPortal>
  <ToastViewport data-testid="custom-viewport" aria-label="Custom notifications" class="top-4 bottom-auto sm:right-auto sm:left-4 max-w-xs">
    {#each manager.toasts as item (item.id)}
      <Toast toast={item} class="top-0 bottom-auto origin-top">
        <ToastContent>
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <ToastTitle />
            <ToastDescription />
          </div>
          <ToastClose />
        </ToastContent>
      </Toast>
    {/each}
  </ToastViewport>
</ToastPortal>
