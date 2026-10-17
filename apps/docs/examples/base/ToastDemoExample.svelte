<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { toast } from '$registry/bases/base/ui/toast';

  function showToast() {
    const id = toast.add({
      title: 'Event created',
      description: 'Sunday, December 3 at 9:00 AM',
      actionProps: {
        children: 'Undo',
        onclick() {
          toast.close(id);
        }
      }
    });
  }
</script>

<Button variant="outline" onclick={showToast}>Show Toast</Button>
