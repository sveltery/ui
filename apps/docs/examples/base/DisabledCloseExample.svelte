<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { DialogCloseState, DialogTriggerHostProps } from '@sveltery/base/dialog';
  import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@sveltery/ui/dialog';
  let { disabled = true }: { disabled?: boolean } = $props();
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>
{#snippet anchor(props: DialogTriggerHostProps, _state: DialogCloseState, children: Snippet)}
  <a {...props} href="#activated">{@render children()}</a>
{/snippet}
<main data-hydrated={hydrated}>
<Dialog>
  <DialogTrigger>Open link example</DialogTrigger>
  <DialogContent showCloseButton={false}>
    <DialogTitle>Link example</DialogTitle>
    <DialogClose render={anchor} nativeButton={false} {disabled}>Link close</DialogClose>
  </DialogContent>
</Dialog>
</main>
