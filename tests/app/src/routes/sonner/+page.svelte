<script lang="ts">
  import { Toaster, toast } from '@sveltery/ui/sonner';
  let log = $state<string[]>([]);
  let settle: { resolve: (value: string) => void; reject: (reason: Error) => void } | undefined;
  let updateId = '';

  function track<Value>(promise: Promise<Value>) {
    promise.then(value => log.push(`resolved ${value}`), error => log.push(`rejected ${error.message}`));
  }
  function startPromise(unwrap: boolean) {
    const pending = new Promise<string>((resolve, reject) => (settle = { resolve, reject }));
    const result = toast.promise(pending, {
      loading: 'Saving event',
      success: name => ({ message: `${name} has been saved`, description: 'Saved to your calendar' }),
      error: error => `Failed: ${(error as Error).message}`
    });
    if (unwrap) track(result.unwrap());
  }
</script>
<Toaster />
<div class="flex flex-wrap gap-2 p-8">
  <button type="button" onclick={() => toast('Event has been created')}>Basic</button>
  <button type="button" onclick={() => toast('Event has been created', { description: 'Monday, January 3rd at 6:00pm' })}>With description</button>
  <button type="button" onclick={() => toast.success('Event has been created')}>Success</button>
  <button type="button" onclick={() => toast.info('Be at the area 10 minutes before the event time')}>Info</button>
  <button type="button" onclick={() => toast.warning('Event start time cannot be earlier than 8am')}>Warning</button>
  <button type="button" onclick={() => toast.error('Event has not been created')}>Error</button>
  <button type="button" onclick={() => toast.loading('Loading data')}>Loading</button>
  <button type="button" onclick={() => toast('Event has been created', { action: { label: 'Undo', onClick: () => log.push('undo') } })}>Action</button>
  <button type="button" onclick={() => toast('Event has been created', { action: { label: 'Keep', onClick: event => { event.preventDefault(); log.push('keep'); } } })}>Action keep</button>
  <button type="button" onclick={() => startPromise(false)}>Promise</button>
  <button type="button" onclick={() => startPromise(true)}>Promise unwrap</button>
  <button type="button" onclick={() => settle?.resolve('Launch party')}>Resolve</button>
  <button type="button" onclick={() => settle?.reject(new Error('Offline'))}>Reject</button>
  <button type="button" onclick={() => toast('Pinned', { duration: Infinity })}>Pinned</button>
  <button type="button" onclick={() => toast('Quick', { duration: 1000 })}>Quick</button>
  <button type="button" onclick={() => (updateId = toast.loading('Uploading'))}>Start upload</button>
  <button type="button" onclick={() => toast.success('Uploaded', { id: updateId })}>Finish upload</button>
  <button type="button" onclick={() => toast.dismiss(updateId)}>Dismiss upload</button>
  <button type="button" onclick={() => toast.dismiss()}>Dismiss all</button>
  <button type="button" onclick={() => { for (const n of [1, 2, 3, 4]) toast(`Toast ${n}`); }}>Four</button>
</div>
<output data-testid="log">{log.join(',')}</output>
