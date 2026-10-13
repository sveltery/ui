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
  import { Field, FieldGroup, FieldLabel } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';

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
      <FieldGroup class="py-4">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input name="name" bind:value={name} />
        </Field>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input name="username" bind:value={username} />
        </Field>
      </FieldGroup>
      <DialogFooter>
        <DialogClose class={buttonVariants({ variant: 'outline' })}>Cancel</DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
