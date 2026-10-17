<script lang="ts">
  import ClipboardPasteIcon from '@lucide/svelte/icons/clipboard-paste';
  import CopyIcon from '@lucide/svelte/icons/copy';
  import ScissorsIcon from '@lucide/svelte/icons/scissors';
  import TrashIcon from '@lucide/svelte/icons/trash';
  import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '$registry/bases/base/ui/context-menu';
</script>

<ContextMenu>
  <ContextMenuTrigger class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
    <span class="hidden pointer-fine:inline-block">Right click here</span>
    <span class="hidden pointer-coarse:inline-block">Long press here</span>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuGroup>
      <ContextMenuItem>
        <CopyIcon />
        Copy
      </ContextMenuItem>
      <ContextMenuItem>
        <ScissorsIcon />
        Cut
      </ContextMenuItem>
      <ContextMenuItem>
        <ClipboardPasteIcon />
        Paste
      </ContextMenuItem>
    </ContextMenuGroup>
    <ContextMenuSeparator />
    <ContextMenuGroup>
      <ContextMenuItem variant="destructive">
        <TrashIcon />
        Delete
      </ContextMenuItem>
    </ContextMenuGroup>
  </ContextMenuContent>
</ContextMenu>
