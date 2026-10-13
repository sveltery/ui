<script lang="ts">
  import { Button, buttonVariants } from '@sveltery/ui/button';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
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

{#snippet LoremParagraphs()}
  <div
    class="no-scrollbar max-h-[70vh] overflow-y-auto style-vega:-mx-6 style-vega:px-6 style-nova:-mx-4 style-nova:px-4 style-lyra:-mx-4 style-lyra:px-4 style-maia:-mx-6 style-maia:px-6 style-mira:-mx-4 style-mira:px-4 style-luma:-mx-6 style-luma:px-6 style-rhea:-mx-6 style-rhea:px-6"
  >
    {#each { length: 10 } as _, index (index)}
      <p class="mb-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
        ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    {/each}
  </div>
{/snippet}

{#snippet DialogWithForm()}
  <Example title="With Form" class="items-center justify-center">
    <Dialog bind:open>
      <DialogTrigger class={buttonVariants({ variant: 'outline' })}>Edit Profile</DialogTrigger>
      <DialogContent>
        <form
          onsubmit={(event) => {
            event.preventDefault();
            open = false;
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done. Your profile will be updated
              immediately.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup class="py-4">
            <Field>
              <FieldLabel for="name-1">Name</FieldLabel>
              <Input id="name-1" name="name" bind:value={name} />
            </Field>
            <Field>
              <FieldLabel for="username-1">Username</FieldLabel>
              <Input id="username-1" name="username" bind:value={username} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose class={buttonVariants({ variant: 'outline' })}>Cancel</DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

{#snippet DialogScrollableContent()}
  <Example title="Scrollable Content" class="items-center justify-center">
    <Dialog>
      <DialogTrigger class={buttonVariants({ variant: 'outline' })}>Scrollable Content</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scrollable Content</DialogTitle>
          <DialogDescription>This is a dialog with scrollable content.</DialogDescription>
        </DialogHeader>
        {@render LoremParagraphs()}
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

{#snippet DialogWithStickyFooter()}
  <Example title="With Sticky Footer" class="items-center justify-center">
    <Dialog>
      <DialogTrigger class={buttonVariants({ variant: 'outline' })}>Sticky Footer</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scrollable Content</DialogTitle>
          <DialogDescription>This is a dialog with scrollable content.</DialogDescription>
        </DialogHeader>
        {@render LoremParagraphs()}
        <DialogFooter>
          <DialogClose class={buttonVariants({ variant: 'outline' })}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

{#snippet DialogNoCloseButton()}
  <Example title="No Close Button" class="items-center justify-center">
    <Dialog>
      <DialogTrigger class={buttonVariants({ variant: 'outline' })}>No Close Button</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>
            This dialog doesn&apos;t have a close button in the top-right corner.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose class={buttonVariants({ variant: 'outline' })}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render DialogWithForm()}
  {@render DialogScrollableContent()}
  {@render DialogWithStickyFooter()}
  {@render DialogNoCloseButton()}
</ExampleWrapper>
