<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
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
    AlertDialogTrigger,
  } from '@sveltery/ui/alert-dialog';
  import { buttonVariants } from '@sveltery/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@sveltery/ui/dialog';
  import { IconPlaceholder } from '@sveltery/ui/icons';
</script>

{#snippet AlertDialogBasic()}
  <Example title="Basic" class="items-center">
    <AlertDialog>
      <AlertDialogTrigger class={buttonVariants({ variant: 'outline' })}>Default</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </Example>
{/snippet}

{#snippet AlertDialogSmall()}
  <Example title="Small" class="items-center">
    <AlertDialog>
      <AlertDialogTrigger class={buttonVariants({ variant: 'outline' })}>Small</AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to allow the USB accessory to connect to this device?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
          <AlertDialogAction>Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </Example>
{/snippet}

{#snippet AlertDialogWithMedia()}
  <Example title="With Media" class="items-center">
    <AlertDialog>
      <AlertDialogTrigger class={buttonVariants({ variant: 'outline' })}>Default (Media)</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <IconPlaceholder
              lucide="BluetoothIcon"
              tabler="IconBluetooth"
              hugeicons="BluetoothIcon"
              phosphor="BluetoothIcon"
              remixicon="RiBluetoothLine"
            />
          </AlertDialogMedia>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </Example>
{/snippet}

{#snippet AlertDialogSmallWithMedia()}
  <Example title="Small With Media" class="items-center">
    <AlertDialog>
      <AlertDialogTrigger class={buttonVariants({ variant: 'outline' })}>Small (Media)</AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <IconPlaceholder
              lucide="BluetoothIcon"
              tabler="IconBluetooth"
              hugeicons="BluetoothIcon"
              phosphor="BluetoothIcon"
              remixicon="RiBluetoothLine"
            />
          </AlertDialogMedia>
          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to allow the USB accessory to connect to this device?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
          <AlertDialogAction>Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </Example>
{/snippet}

{#snippet AlertDialogDestructive()}
  <Example title="Destructive" class="items-center">
    <AlertDialog>
      <AlertDialogTrigger class={buttonVariants({ variant: 'destructive' })}>Delete Chat</AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <IconPlaceholder
              lucide="Trash2Icon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
            />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat conversation. View
            <!-- svelte-ignore a11y_invalid_attribute -->
            <a href="#">Settings</a> delete any memories saved during this chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="ghost">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </Example>
{/snippet}

{#snippet AlertDialogInDialog()}
  <Example title="In Dialog" class="items-center">
    <Dialog>
      <DialogTrigger class={buttonVariants({ variant: 'outline' })}>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alert Dialog Example</DialogTitle>
          <DialogDescription>Click the button below to open an alert dialog.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <AlertDialog>
            <AlertDialogTrigger class={buttonVariants()}>Open Alert Dialog</AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render AlertDialogBasic()}
  {@render AlertDialogSmall()}
  {@render AlertDialogWithMedia()}
  {@render AlertDialogSmallWithMedia()}
  {@render AlertDialogDestructive()}
  {@render AlertDialogInDialog()}
</ExampleWrapper>
