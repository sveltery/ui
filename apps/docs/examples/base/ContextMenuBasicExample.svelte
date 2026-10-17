<script lang="ts">
  import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuTrigger } from '$registry/bases/base/ui/context-menu';
</script>

<ContextMenu>
  <ContextMenuTrigger class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
    <span class="hidden pointer-fine:inline-block">Right click here</span>
    <span class="hidden pointer-coarse:inline-block">Long press here</span>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuGroup>
      <ContextMenuItem>Back</ContextMenuItem>
      <ContextMenuItem disabled>Forward</ContextMenuItem>
      <ContextMenuItem>Reload</ContextMenuItem>
    </ContextMenuGroup>
  </ContextMenuContent>
</ContextMenu>
