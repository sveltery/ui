<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '$registry/bases/base/ui/dialog';
  import { Field, FieldGroup } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
  import { Label } from '$registry/bases/base/ui/label';

  let open = $state(false);
</script>

<Dialog bind:open>
  <DialogTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Open Dialog
  </DialogTrigger>
  <DialogContent class="sm:max-w-sm">
    <form
      class="contents"
      onsubmit={(event) => {
        event.preventDefault();
        open = false;
      }}
    >
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <Label for="name-1">Name</Label>
          <Input id="name-1" name="name" value="Pedro Duarte" />
        </Field>
        <Field>
          <Label for="username-1">Username</Label>
          <Input id="username-1" name="username" value="@peduarte" />
        </Field>
      </FieldGroup>
      <DialogFooter>
        <DialogClose>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Cancel
        </DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
