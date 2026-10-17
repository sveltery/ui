<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '$registry/bases/base/ui/dialog';
</script>

<Dialog>
  <DialogTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    No Close Button
  </DialogTrigger>
  <DialogContent showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>No Close Button</DialogTitle>
      <DialogDescription>This dialog doesn't have a close button in the top-right corner.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
