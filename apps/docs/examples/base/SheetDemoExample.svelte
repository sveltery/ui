<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Input } from '$registry/bases/base/ui/input';
  import { Label } from '$registry/bases/base/ui/label';
  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
  } from '$registry/bases/base/ui/sheet';
</script>

<Sheet>
  <SheetTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Open
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
    </SheetHeader>
    <div class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <Label for="sheet-demo-name">Name</Label>
        <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
      </div>
      <div class="grid gap-3">
        <Label for="sheet-demo-username">Username</Label>
        <Input id="sheet-demo-username" defaultValue="@peduarte" />
      </div>
    </div>
    <SheetFooter>
      <Button type="submit">Save changes</Button>
      <SheetClose>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Close
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
