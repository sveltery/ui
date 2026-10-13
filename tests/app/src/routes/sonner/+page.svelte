<script lang="ts">
  import { Toaster, toast, type ToastPosition } from '@sveltery/ui/sonner';
  const positions: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
  let position = $state<ToastPosition | 'default'>('default');
  let richColors = $state(false);
  let closeButton = $state(false);
  let styled = $state(false);
  let labelled = $state(false);
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
<Toaster position={position === 'default' ? undefined : position} {richColors} {closeButton} closeButtonAriaLabel={labelled ? 'Dismiss notification' : undefined} classNames={styled ? { description: 'italic', closeButton: 'bg-yellow-200' } : undefined} />
{#snippet custom(id: string)}
  <div data-testid="custom-body" class="w-full rounded-md bg-fuchsia-600 p-3 text-white">
    Custom body {id.length > 0 ? 'ready' : 'missing id'}
    <button type="button" data-testid="custom-dismiss" onclick={() => toast.dismiss(id)}>Dismiss custom</button>
  </div>
{/snippet}
<div class="flex min-h-svh flex-wrap content-center items-center gap-2 p-8">
  <select aria-label="Position" bind:value={position}>
    {#each ['default', ...positions] as value (value)}<option {value}>{value}</option>{/each}
  </select>
  <label><input type="checkbox" bind:checked={richColors} /> richColors</label>
  <label><input type="checkbox" bind:checked={closeButton} /> closeButton</label>
  <label><input type="checkbox" bind:checked={styled} /> classNames</label>
  <label><input type="checkbox" bind:checked={labelled} /> closeButtonAriaLabel</label>
  <button type="button" onclick={() => { toast('First'); toast('Second'); }}>Two</button>
  <button type="button" onclick={() => toast.success('Rich on', { richColors: true })}>Rich on</button>
  <button type="button" onclick={() => toast.success('Rich off', { richColors: false })}>Rich off</button>
  <button type="button" onclick={() => toast('Closable', { closeButton: true })}>Closable</button>
  <button type="button" onclick={() => toast('Unclosable', { closeButton: false })}>Unclosable</button>
  <button type="button" onclick={() => toast('Styled', { description: 'Details', className: 'border-dashed bg-yellow-100', classNames: { title: 'uppercase' } })}>Styled</button>
  <button type="button" onclick={() => toast.custom(custom)}>Custom</button>
  <button type="button" onclick={() => toast.custom(custom, { duration: 1000, className: 'opacity-90' })}>Short custom</button>
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
