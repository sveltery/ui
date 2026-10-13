<script lang="ts">
  import * as UI from '$ui/alert-dialog/index.js';
  let { events = [] }: { events?: string[] } = $props();
  let open = $state(false);
  export function isOpen() { return open; }
</script>
<UI.AlertDialog bind:open onOpenChange={(next, details) => events.push(`change:${next}:${details.reason}`)}>
  <UI.AlertDialogTrigger>Delete</UI.AlertDialogTrigger>
  <UI.AlertDialogContent size="sm">
    <UI.AlertDialogHeader>
      <UI.AlertDialogMedia>!</UI.AlertDialogMedia>
      <UI.AlertDialogTitle>Delete the project?</UI.AlertDialogTitle>
      <UI.AlertDialogDescription>This cannot be undone.</UI.AlertDialogDescription>
    </UI.AlertDialogHeader>
    <UI.AlertDialogFooter>
      <UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
      <UI.AlertDialogAction variant="destructive" onclick={() => events.push('action')}>Delete</UI.AlertDialogAction>
    </UI.AlertDialogFooter>
  </UI.AlertDialogContent>
</UI.AlertDialog>
