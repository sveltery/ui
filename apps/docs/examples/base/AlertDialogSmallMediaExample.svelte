<script lang="ts">
  import BluetoothIcon from '@lucide/svelte/icons/bluetooth';
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
    Show Dialog
  </AlertDialogTrigger>
  <AlertDialogContent size="sm">
    <AlertDialogHeader>
      <AlertDialogMedia>
        <BluetoothIcon />
      </AlertDialogMedia>
      <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
      <AlertDialogDescription>
        Do you want to allow the USB accessory to connect to this device?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Don't allow</AlertDialogCancel>
      <AlertDialogAction>Allow</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
