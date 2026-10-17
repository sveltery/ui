<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { cn } from 'cn';
  import { Button } from '$registry/bases/base/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '$registry/bases/base/ui/dialog';
  import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '$registry/bases/base/ui/drawer';
  import { Input } from '$registry/bases/base/ui/input';
  import { Label } from '$registry/bases/base/ui/label';

  let open = $state(false);
  const isDesktop = new MediaQuery('min-width: 768px');
</script>

{#snippet profileForm(className?: string)}
  <form class={cn('grid items-start gap-6', className)}>
    <div class="grid gap-3">
      <Label for="email">Email</Label>
      <Input type="email" id="email" value="shadcn@example.com" />
    </div>
    <div class="grid gap-3">
      <Label for="username">Username</Label>
      <Input id="username" value="@shadcn" />
    </div>
    <Button type="submit">Save changes</Button>
  </form>
{/snippet}

{#if isDesktop.current}
  <Dialog bind:open>
    <DialogTrigger>
      {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
      Edit Profile
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
      </DialogHeader>
      {@render profileForm()}
    </DialogContent>
  </Dialog>
{:else}
  <Drawer bind:open>
    <DrawerTrigger>
      {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
      Edit Profile
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader class="text-left">
        <DrawerTitle>Edit profile</DrawerTitle>
        <DrawerDescription>Make changes to your profile here. Click save when you&apos;re done.</DrawerDescription>
      </DrawerHeader>
      {@render profileForm('p-4')}
    </DrawerContent>
  </Drawer>
{/if}
