<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { DialogCloseState, DialogTriggerHostProps } from '@sveltery/base/dialog';
  import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@sveltery/components/dialog';
  let { data } = $props();
</script>
{#snippet anchor(props: DialogTriggerHostProps, _state: DialogCloseState, children: Snippet | undefined)}
  <a {...props} href="#activated">{@render children?.()}</a>
{/snippet}
<Dialog>
  <DialogTrigger>Open link example</DialogTrigger>
  <DialogContent showCloseButton={false}>
    <DialogTitle>Link example</DialogTitle>
    <DialogClose render={anchor} nativeButton={false} disabled={data.disabled}>Link close</DialogClose>
  </DialogContent>
</Dialog>
