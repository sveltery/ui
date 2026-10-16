<script lang="ts">
  import { ToastProvider, Toaster, createToastManager, toast } from '$registry/bases/base/ui/toast';
  import CustomList from './CustomList.svelte';

  const custom = createToastManager();
  const short = createToastManager();
  let log = $state<string[]>([]);
  let settle: { resolve: (value: { name: string }) => void; reject: (reason: Error) => void } | undefined;
  let updateId = '';

  function showAction() {
    const id = toast.add({
      title: 'Event created',
      description: 'You can undo this action.',
      actionProps: {
        children: 'Undo',
        onclick() {
          log.push('undo');
          toast.close(id);
          toast.add({ description: 'Event creation undone.' });
        }
      }
    });
  }
  function showPromise() {
    const pending = new Promise<{ name: string }>((resolve, reject) => (settle = { resolve, reject }));
    toast.promise(pending, {
      loading: 'Creating event…',
      success: data => `${data.name} created.`,
      error: 'Could not create event.'
    }).catch(() => {});
  }
</script>

<Toaster />
<Toaster toastManager={short} timeout={1500}>
  <span data-testid="toaster-child">Toaster child</span>
</Toaster>
<ToastProvider toastManager={custom} timeout={0}>
  <CustomList />
</ToastProvider>

<div class="flex flex-wrap gap-2 p-8 pt-40">
  <button type="button" onclick={() => toast.add({ title: 'Event created', description: 'Sunday, December 3 at 9:00 AM' })}>Basic</button>
  <button type="button" onclick={showAction}>Action</button>
  <button type="button" onclick={showPromise}>Promise</button>
  <button type="button" onclick={() => settle?.resolve({ name: 'Event' })}>Resolve</button>
  <button type="button" onclick={() => settle?.reject(new Error('Offline'))}>Reject</button>
  {#each ['success', 'info', 'warning', 'error', 'loading'] as type (type)}
    <button type="button" onclick={() => toast.add({ title: `A ${type} toast`, type })}>Type {type}</button>
  {/each}
  <button type="button" onclick={() => toast.add({ title: 'Pinned', timeout: 0 })}>Pinned</button>
  <button type="button" onclick={() => toast.add({ title: 'Quick', timeout: 1000 })}>Quick</button>
  <button type="button" onclick={() => (updateId = toast.add({ title: 'Uploading', type: 'loading', timeout: 0 }))}>Start upload</button>
  <button type="button" onclick={() => toast.update(updateId, { title: 'Uploaded', type: 'success' })}>Finish upload</button>
  <button type="button" onclick={() => toast.close(updateId)}>Close upload</button>
  <button type="button" onclick={() => toast.close()}>Close all</button>
  <button type="button" onclick={() => { for (const n of [1, 2, 3, 4]) toast.add({ title: `Toast ${n}`, timeout: 0 }); }}>Four</button>
  <button type="button" onclick={() => short.add({ title: 'Short toast' })}>Short</button>
  <button type="button" onclick={() => custom.add({ title: 'Custom toast', description: 'Own manager' })}>Custom</button>
</div>
<output data-testid="log">{log.join(',')}</output>
