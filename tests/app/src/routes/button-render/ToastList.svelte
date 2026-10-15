<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { Toast, ToastAction, ToastClose, ToastContent, ToastPortal, ToastTitle, ToastViewport, getToastManager } from '@sveltery/ui/toast';

  const manager = getToastManager();
</script>

{#snippet plain(props: HTMLButtonAttributes, _state: unknown, content: Snippet | undefined)}
  <button {...props}>{@render content?.()}</button>
{/snippet}

<ToastPortal>
  <ToastViewport>
    {#each manager.toasts as item (item.id)}
      <Toast toast={item}>
        <ToastContent>
          <ToastTitle />
          <ToastAction render={plain} />
          <ToastClose render={plain} />
          <ToastAction data-testid="action-undefined" render={undefined} />
          <ToastClose data-testid="close-undefined" render={undefined} />
        </ToastContent>
      </Toast>
    {/each}
  </ToastViewport>
</ToastPortal>
