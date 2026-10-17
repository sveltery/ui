<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '$registry/bases/base/ui/sheet';
</script>

<Sheet>
  <SheetTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Open Sheet
  </SheetTrigger>
  <SheetContent showCloseButton={false}>
    <SheetHeader>
      <SheetTitle>No Close Button</SheetTitle>
      <SheetDescription>
        This sheet doesn&apos;t have a close button in the top-right corner. Click outside to close.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
