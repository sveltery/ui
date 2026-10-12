<script lang="ts">
  import { Button, buttonVariants } from '@sveltery/ui/button';
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@sveltery/ui/dialog';
  import { Label } from '@sveltery/ui/label';

  let open = $state(false);
  let name = $state('Pedro Duarte');
  let username = $state('@peduarte');
</script>

<Dialog bind:open>
  <DialogTrigger class={buttonVariants({ variant: 'outline' })}>Edit Profile</DialogTrigger>
  <DialogContent class="sm:max-w-sm">
    <form
      onsubmit={(event) => {
        event.preventDefault();
        open = false;
      }}
    >
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-3">
          <Label for="name">Name</Label>
          <input id="name" name="name" bind:value={name} class="h-8 rounded-lg border border-border px-2" />
        </div>
        <div class="grid gap-3">
          <Label for="username">Username</Label>
          <input id="username" name="username" bind:value={username} class="h-8 rounded-lg border border-border px-2" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose class={buttonVariants({ variant: 'outline' })}>Cancel</DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
