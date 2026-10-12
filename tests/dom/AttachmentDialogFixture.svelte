<script lang="ts">
  import { Attachment, AttachmentTrigger } from '$ui/attachment/index.js';
  import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '$ui/dialog/index.js';
</script>
<Dialog>
  <Attachment>
    <DialogTrigger>
      {#snippet render(props)}
        <AttachmentTrigger {...props} aria-label="Preview" />
      {/snippet}
    </DialogTrigger>
  </Attachment>
  <DialogContent><DialogTitle>Preview title</DialogTitle></DialogContent>
</Dialog>
