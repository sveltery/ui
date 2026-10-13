<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { toast, type ToastPosition } from '@sveltery/ui/sonner';
  import { sonnerPosition } from './sonner/position.svelte.js';

  const positions: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

  $effect(() => () => (sonnerPosition.value = 'bottom-right'));
</script>

{#snippet SonnerBasic()}
  <Example title="Basic" class="items-center justify-center">
    <Button onclick={() => toast('Event has been created')} variant="outline" class="w-fit">Show Toast</Button>
  </Example>
{/snippet}

{#snippet SonnerWithDescription()}
  <Example title="With Description" class="items-center justify-center">
    <Button onclick={() => toast('Event has been created', { description: 'Monday, January 3rd at 6:00pm' })} variant="outline" class="w-fit">Show Toast</Button>
  </Example>
{/snippet}

{#snippet SonnerPosition()}
  <Example title="Position" class="items-center justify-center">
    <div class="grid grid-cols-3 gap-2">
      {#each positions as position (position)}
        <Button
          onclick={() => {
            sonnerPosition.value = position;
            toast('Event has been created', { description: position });
          }}
          variant="outline"
          size="sm"
        >
          {position}
        </Button>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet SonnerRichColors()}
  <Example title="Rich Colors" class="items-center justify-center">
    <div class="flex flex-wrap justify-center gap-2">
      <Button onclick={() => toast.success('Event has been created', { richColors: true })} variant="outline">Success</Button>
      <Button onclick={() => toast.info('Be at the area 10 minutes before the event time', { richColors: true })} variant="outline">Info</Button>
      <Button onclick={() => toast.warning('Event start time cannot be earlier than 8am', { richColors: true })} variant="outline">Warning</Button>
      <Button onclick={() => toast.error('Event has not been created', { richColors: true })} variant="outline">Error</Button>
    </div>
  </Example>
{/snippet}

{#snippet SonnerCloseButton()}
  <Example title="Close Button" class="items-center justify-center">
    <Button onclick={() => toast('Event has been created', { description: 'Monday, January 3rd at 6:00pm', closeButton: true, duration: Infinity })} variant="outline" class="w-fit">Show Toast</Button>
  </Example>
{/snippet}

{#snippet invite(id: string)}
  <div class="flex w-full items-center gap-3 rounded-2xl border bg-popover p-4 text-popover-foreground shadow-lg">
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <p class="text-sm font-medium">New invite</p>
      <p class="text-sm text-muted-foreground">Ada invited you to the Sveltery team.</p>
    </div>
    <Button onclick={() => toast.dismiss(id)} size="sm">Accept</Button>
  </div>
{/snippet}

{#snippet SonnerCustom()}
  <Example title="Custom" class="items-center justify-center">
    <Button onclick={() => toast.custom(invite)} variant="outline" class="w-fit">Show Toast</Button>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render SonnerBasic()}
  {@render SonnerWithDescription()}
  {@render SonnerPosition()}
  {@render SonnerRichColors()}
  {@render SonnerCloseButton()}
  {@render SonnerCustom()}
</ExampleWrapper>
