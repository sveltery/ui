<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '$registry/bases/base/ui/dialog';
</script>

<Dialog>
  <DialogTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Scrollable Content
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Scrollable Content</DialogTitle>
      <DialogDescription>This is a dialog with scrollable content.</DialogDescription>
    </DialogHeader>
    <div class="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
      {#each { length: 10 }, index (index)}
        <p class="mb-4 leading-normal">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      {/each}
    </div>
  </DialogContent>
</Dialog>
