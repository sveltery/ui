<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import { toast } from '@sveltery/components/toast';

  function showActionToast() {
    const id = toast.add({
      title: 'Event created',
      description: 'You can undo this action.',
      actionProps: {
        children: 'Undo',
        onclick() {
          toast.close(id);
          toast.add({ description: 'Event creation undone.' });
        }
      }
    });
  }

  function showPromiseToast() {
    toast.promise(new Promise<{ name: string }>(resolve => window.setTimeout(() => resolve({ name: 'Event' }), 2000)), {
      loading: 'Creating event…',
      success: data => `${data.name} created.`,
      error: 'Could not create event.'
    });
  }
</script>

{#snippet ToastBasic()}
  <Example title="Basic" class="items-center justify-center">
    <Button variant="outline" class="w-fit" onclick={() => toast.add({ title: 'Event created', description: 'Sunday, December 3 at 9:00 AM' })}>Show Toast</Button>
  </Example>
{/snippet}

{#snippet ToastWithAction()}
  <Example title="With Action" class="items-center justify-center">
    <Button variant="outline" class="w-fit" onclick={showActionToast}>Show Toast</Button>
  </Example>
{/snippet}

{#snippet ToastPromise()}
  <Example title="Promise" class="items-center justify-center">
    <Button variant="outline" class="w-fit" onclick={showPromiseToast}>Create Event</Button>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render ToastBasic()}
  {@render ToastWithAction()}
  {@render ToastPromise()}
</ExampleWrapper>
