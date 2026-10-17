<script lang="ts">
  import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuTrigger } from '$registry/bases/base/ui/context-menu';

  let showBookmarksBar = $state(true);
  let showFullUrls = $state(false);
  let showDeveloperTools = $state(true);
</script>

<ContextMenu>
  <ContextMenuTrigger class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
    <span class="hidden pointer-fine:inline-block">Right click here</span>
    <span class="hidden pointer-coarse:inline-block">Long press here</span>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuGroup>
      <ContextMenuCheckboxItem bind:checked={showBookmarksBar}>Show Bookmarks Bar</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem bind:checked={showFullUrls}>Show Full URLs</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem bind:checked={showDeveloperTools}>Show Developer Tools</ContextMenuCheckboxItem>
    </ContextMenuGroup>
  </ContextMenuContent>
</ContextMenu>
