<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTitle } from '@sveltery/components/alert-dialog';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from '@sveltery/components/message-scroller';
  import { ToastProvider, createToastManager } from '@sveltery/components/toast';
  import ToastList from './ToastList.svelte';

  const manager = createToastManager();
  onMount(() => { manager.add({ title: 'Saved', timeout: 0, actionProps: { children: 'Undo' } }); });
</script>

{#snippet plain(props: HTMLAttributes<HTMLElement>, _state: unknown, content: Snippet | undefined)}
  <button type="button" {...props}>{@render content?.()}</button>
{/snippet}

{#snippet plainScroller(props: HTMLButtonAttributes)}
  <button {...props}>Jump</button>
{/snippet}

<AlertDialog open>
  <AlertDialogContent>
    <AlertDialogTitle>Discard draft?</AlertDialogTitle>
    <AlertDialogCancel render={plain}>Keep editing</AlertDialogCancel>
  </AlertDialogContent>
</AlertDialog>

<ToastProvider toastManager={manager}>
  <ToastList />
</ToastProvider>

<MessageScrollerProvider>
  <MessageScroller class="h-40">
    <MessageScrollerViewport>
      <MessageScrollerContent><div style="height: 400px">Messages</div></MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton render={plainScroller} />
    <MessageScrollerButton data-testid="scroller-undefined" direction="start" render={undefined} />
  </MessageScroller>
</MessageScrollerProvider>
