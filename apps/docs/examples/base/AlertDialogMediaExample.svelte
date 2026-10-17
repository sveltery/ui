<script lang="ts">
  import CircleFadingPlusIcon from '@lucide/svelte/icons/circle-fading-plus';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger
  } from '$registry/bases/base/ui/alert-dialog';
  import { Button } from '$registry/bases/base/ui/button';
</script>

<AlertDialog>
  <AlertDialogTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Share Project
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogMedia>
        <CircleFadingPlusIcon />
      </AlertDialogMedia>
      <AlertDialogTitle>Share this project?</AlertDialogTitle>
      <AlertDialogDescription>
        Anyone with the link will be able to view and edit this project.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Share</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
