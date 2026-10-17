<script lang="ts">
  import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuTrigger
  } from '$registry/bases/base/ui/context-menu';

  let user = $state('pedro');
  let theme = $state('light');
</script>

<ContextMenu>
  <ContextMenuTrigger class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
    <span class="hidden pointer-fine:inline-block">Right click here</span>
    <span class="hidden pointer-coarse:inline-block">Long press here</span>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuGroup>
      <ContextMenuLabel>People</ContextMenuLabel>
      <ContextMenuRadioGroup bind:value={user}>
        <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
        <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
    </ContextMenuGroup>
    <ContextMenuSeparator />
    <ContextMenuGroup>
      <ContextMenuLabel>Theme</ContextMenuLabel>
      <ContextMenuRadioGroup bind:value={theme}>
        <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
        <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
        <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
    </ContextMenuGroup>
  </ContextMenuContent>
</ContextMenu>
