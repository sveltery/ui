<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { toast } from '$registry/bases/base/ui/toast';

  function showToast() {
    toast.promise(
      new Promise<{ name: string }>(resolve => {
        window.setTimeout(() => resolve({ name: 'Event' }), 2000);
      }),
      {
        loading: 'Creating event…',
        success: data => `${data.name} created.`,
        error: 'Could not create event.'
      }
    );
  }
</script>

<Button variant="outline" onclick={showToast}>Create Event</Button>
