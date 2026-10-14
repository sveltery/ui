<script lang="ts">
  import { toast, type ToasterProps } from 'svelte-sonner';
  import { Toaster } from '@sveltery/ui/sonner';
  const props = $state<ToasterProps>({});
</script>
<Toaster {...props} />
<div class="flex min-h-svh flex-wrap content-center items-center gap-2 p-8">
  <button type="button" onclick={() => (props.position = 'top-center')}>Top center</button>
  <button type="button" onclick={() => (props.theme = 'dark')}>Dark theme</button>
  <button type="button" onclick={() => toast('Event has been created', { description: 'Monday, January 3rd at 6:00pm' })}>Default</button>
  <button type="button" onclick={() => toast.success('Success toast')}>Success</button>
  <button type="button" onclick={() => toast.info('Info toast')}>Info</button>
  <button type="button" onclick={() => toast.warning('Warning toast')}>Warning</button>
  <button type="button" onclick={() => toast.error('Error toast')}>Error</button>
  <button type="button" onclick={() => toast.loading('Loading toast')}>Loading</button>
</div>
