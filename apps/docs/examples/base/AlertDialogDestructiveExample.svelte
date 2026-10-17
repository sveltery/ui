<script lang="ts">
  import Trash2Icon from '@lucide/svelte/icons/trash-2';
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
    {#snippet render(props, _state, content)}<Button variant="destructive" {...props}>{@render content?.()}</Button>{/snippet}
    Delete Chat
  </AlertDialogTrigger>
  <AlertDialogContent size="sm">
    <AlertDialogHeader>
      <AlertDialogMedia class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
        <Trash2Icon />
      </AlertDialogMedia>
      <AlertDialogTitle>Delete chat?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete this chat conversation. View
        <!-- svelte-ignore a11y_invalid_attribute -->
        <a href="#">Settings</a> delete any memories saved during this chat.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
