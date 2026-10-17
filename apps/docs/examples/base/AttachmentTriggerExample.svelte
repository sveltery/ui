<script lang="ts">
  import CopyIcon from '@lucide/svelte/icons/copy';
  import FileSearchIcon from '@lucide/svelte/icons/file-search';
  import XIcon from '@lucide/svelte/icons/x';
  import {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentMedia,
    AttachmentTitle,
    AttachmentTrigger
  } from '$registry/bases/base/ui/attachment';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '$registry/bases/base/ui/dialog';
</script>

<div class="mx-auto w-full max-w-sm py-12">
  <Dialog>
    <Attachment class="w-full">
      <AttachmentMedia>
        <FileSearchIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>research-summary.pdf</AttachmentTitle>
        <AttachmentDescription>Open preview dialog</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Copy link">
          <CopyIcon />
        </AttachmentAction>
        <AttachmentAction aria-label="Remove research-summary.pdf">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
      <DialogTrigger>
        {#snippet render(props)}
          <AttachmentTrigger {...props} aria-label="Preview research-summary.pdf" />
        {/snippet}
      </DialogTrigger>
    </Attachment>
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>research-summary.pdf</DialogTitle>
        <DialogDescription>
          The attachment trigger fills the card and opens the dialog, while the actions stay independently clickable above it.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</div>
