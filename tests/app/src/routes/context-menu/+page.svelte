<script lang="ts">
  import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger
  } from '$registry/bases/base/ui/context-menu';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '$registry/bases/base/ui/dialog';

  let last = $state('none');
  let bookmarks = $state(true);
  let theme = $state('light');
  let disabled = $state(false);
  const buttonClass = 'cn-button cn-button-variant-outline cn-button-size-default inline-flex items-center justify-center';
  const areaClass = 'flex h-40 w-96 items-center justify-center rounded-lg border text-sm';
</script>
<div class="flex flex-col gap-6 p-8">
  <ContextMenu>
    <ContextMenuTrigger class={areaClass} data-testid="area">Right click here</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuLabel>Navigation</ContextMenuLabel>
        <ContextMenuItem onclick={() => (last = 'Back')}>Back<ContextMenuShortcut>⌘[</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuItem disabled onclick={() => (last = 'Forward')}>Forward</ContextMenuItem>
        <ContextMenuItem onclick={() => (last = 'Reload')}>Reload</ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuSub>
        <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
        <ContextMenuSubContent class="sub-extra">
          <ContextMenuItem onclick={() => (last = 'Save Page')}>Save Page...</ContextMenuItem>
          <ContextMenuItem onclick={() => (last = 'Developer Tools')}>Developer Tools</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem bind:checked={bookmarks}>Show Bookmarks Bar</ContextMenuCheckboxItem>
      <ContextMenuSeparator />
      <ContextMenuRadioGroup bind:value={theme}>
        <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
        <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
        <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive" onclick={() => (last = 'Delete')}>Delete</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>

  <ContextMenu {disabled}>
    <ContextMenuTrigger class="flex h-16 w-96 items-center justify-center rounded-lg border text-sm" data-testid="second-area">Second area</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem onclick={() => (last = 'Second')}>Second action</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>

  <ContextMenu>
    <ContextMenuTrigger class="flex h-16 w-96 items-center justify-center rounded-lg border text-sm" data-testid="left-area">Left side area</ContextMenuTrigger>
    <ContextMenuContent side="left" align="end">
      <ContextMenuItem onclick={() => (last = 'Left action')}>Left action</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>

  <button type="button" class={buttonClass} onclick={() => (disabled = !disabled)}>Toggle disabled</button>
  <button type="button" class={buttonClass}>Outside</button>

  <Dialog>
    <DialogTrigger class={buttonClass}>Open Dialog</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Context Menu Example</DialogTitle>
        <DialogDescription>Right click on the area below to see the context menu.</DialogDescription>
      </DialogHeader>
      <ContextMenu>
        <ContextMenuTrigger class="flex h-24 w-full items-center justify-center rounded-lg border text-sm" data-testid="dialog-area">Dialog area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onclick={() => (last = 'Copy')}>Copy</ContextMenuItem>
          <ContextMenuItem onclick={() => (last = 'Paste')}>Paste</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </DialogContent>
  </Dialog>

  <output>Last: {last}; Bookmarks: {bookmarks}; Theme: {theme}</output>
</div>
