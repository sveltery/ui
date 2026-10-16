<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Button } from '$registry/bases/base/ui/button';
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
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const sides = ['inline-start', 'left', 'top', 'bottom', 'right', 'inline-end'] as const;

  let showBookmarksBar = $state(true);
  let showFullUrls = $state(false);
  let showDeveloperTools = $state(true);
  let person = $state('pedro');
  let radioTheme = $state('light');
  let showBookmarks = $state(true);
  let showUrls = $state(false);
  let theme = $state('system');
</script>

{#snippet ContextMenuBasic()}
  <Example title="Basic">
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem disabled>Forward</ContextMenuItem>
          <ContextMenuItem>Reload</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </Example>
{/snippet}

{#snippet ContextMenuWithIcons()}
  <Example title="With Icons">
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="CopyIcon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />
            Copy
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder lucide="ScissorsIcon" tabler="IconCut" hugeicons="ScissorIcon" phosphor="ScissorsIcon" remixicon="RiScissorsLine" />
            Cut
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder lucide="ClipboardPasteIcon" tabler="IconClipboard" hugeicons="ClipboardIcon" phosphor="ClipboardIcon" remixicon="RiClipboardLine" />
            Paste
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">
            <IconPlaceholder lucide="TrashIcon" tabler="IconTrash" hugeicons="DeleteIcon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </Example>
{/snippet}

{#snippet ContextMenuWithSides()}
  <Example title="With Sides" containerClass="col-span-2">
    <div class="flex flex-wrap justify-center gap-2">
      {#each sides as side (side)}
        <ContextMenu>
          <ContextMenuTrigger class="flex aspect-[2/0.5] items-center justify-center rounded-lg border p-4 text-sm capitalize">
            {side.replace('-', ' ')}
          </ContextMenuTrigger>
          <ContextMenuContent {side}>
            <ContextMenuGroup>
              <ContextMenuItem>Back</ContextMenuItem>
              <ContextMenuItem>Forward</ContextMenuItem>
              <ContextMenuItem>Reload</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet ContextMenuWithShortcuts()}
  <Example title="With Shortcuts">
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            Save
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Save As...
            <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </Example>
{/snippet}

{#snippet ContextMenuWithSubmenu()}
  <Example title="With Submenu">
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuGroup>
              <ContextMenuItem>Save Page...</ContextMenuItem>
              <ContextMenuItem>Create Shortcut...</ContextMenuItem>
              <ContextMenuItem>Name Window...</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem>Developer Tools</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  </Example>
{/snippet}

{#snippet ContextMenuWithGroups()}
  <Example title="With Groups, Labels & Separators">
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>File</ContextMenuLabel>
          <ContextMenuItem>
            New File
            <ContextMenuShortcut>⌘N</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Open File
            <ContextMenuShortcut>⌘O</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Save
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Edit</ContextMenuLabel>
          <ContextMenuItem>
            Undo
            <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Redo
            <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </Example>
{/snippet}

{#snippet ContextMenuWithCheckboxes()}
  <Example title="With Checkboxes">
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuCheckboxItem bind:checked={showBookmarksBar}>Show Bookmarks Bar</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem bind:checked={showFullUrls}>Show Full URLs</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem bind:checked={showDeveloperTools}>Show Developer Tools</ContextMenuCheckboxItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </Example>
{/snippet}

{#snippet ContextMenuWithRadio()}
  <Example title="With Radio Group">
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuRadioGroup bind:value={person}>
            <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Theme</ContextMenuLabel>
          <ContextMenuRadioGroup bind:value={radioTheme}>
            <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
            <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
            <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </Example>
{/snippet}

{#snippet ContextMenuWithDestructive()}
  <Example title="With Destructive Items">
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <IconPlaceholder lucide="PencilIcon" tabler="IconPencil" hugeicons="EditIcon" phosphor="PencilIcon" remixicon="RiPencilLine" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder lucide="ShareIcon" tabler="IconShare" hugeicons="ShareIcon" phosphor="ShareIcon" remixicon="RiShareLine" />
            Share
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            <IconPlaceholder lucide="ArchiveIcon" tabler="IconArchive" hugeicons="Archive02Icon" phosphor="ArchiveIcon" remixicon="RiArchiveLine" />
            Archive
          </ContextMenuItem>
          <ContextMenuItem variant="destructive">
            <IconPlaceholder lucide="TrashIcon" tabler="IconTrash" hugeicons="DeleteIcon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </Example>
{/snippet}

{#snippet ContextMenuInDialog()}
  <Example title="In Dialog">
    <Dialog>
      <DialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Open Dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Context Menu Example</DialogTitle>
          <DialogDescription>Right click on the area below to see the context menu.</DialogDescription>
        </DialogHeader>
        <ContextMenu>
          <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">Right click here</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuGroup>
              <ContextMenuItem>
                <IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="CopyIcon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />
                Copy
              </ContextMenuItem>
              <ContextMenuItem>
                <IconPlaceholder lucide="ScissorsIcon" tabler="IconCut" hugeicons="ScissorIcon" phosphor="ScissorsIcon" remixicon="RiScissorsLine" />
                Cut
              </ContextMenuItem>
              <ContextMenuItem>
                <IconPlaceholder lucide="ClipboardPasteIcon" tabler="IconClipboard" hugeicons="ClipboardIcon" phosphor="ClipboardIcon" remixicon="RiClipboardLine" />
                Paste
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuGroup>
                  <ContextMenuItem>Save Page...</ContextMenuItem>
                  <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                  <ContextMenuItem>Name Window...</ContextMenuItem>
                </ContextMenuGroup>
                <ContextMenuSeparator />
                <ContextMenuGroup>
                  <ContextMenuItem>Developer Tools</ContextMenuItem>
                </ContextMenuGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem variant="destructive">
                <IconPlaceholder lucide="TrashIcon" tabler="IconTrash" hugeicons="DeleteIcon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
                Delete
              </ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

{#snippet ContextMenuWithInset()}
  <Example title="With Inset">
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">Right click here</ContextMenuTrigger>
      <ContextMenuContent class="w-44">
        <ContextMenuGroup>
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuItem>
            <IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="CopyIcon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />
            Copy
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder lucide="ScissorsIcon" tabler="IconCut" hugeicons="ScissorIcon" phosphor="ScissorsIcon" remixicon="RiScissorsLine" />
            Cut
          </ContextMenuItem>
          <ContextMenuItem inset>Paste</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel inset>Appearance</ContextMenuLabel>
          <ContextMenuCheckboxItem inset bind:checked={showBookmarks}>Bookmarks</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem inset bind:checked={showUrls}>Full URLs</ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel inset>Theme</ContextMenuLabel>
          <ContextMenuRadioGroup bind:value={theme}>
            <ContextMenuRadioItem inset value="light">Light</ContextMenuRadioItem>
            <ContextMenuRadioItem inset value="dark">Dark</ContextMenuRadioItem>
            <ContextMenuRadioItem inset value="system">System</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Options</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuGroup>
              <ContextMenuItem>Save Page...</ContextMenuItem>
              <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render ContextMenuBasic()}
  {@render ContextMenuWithIcons()}
  {@render ContextMenuWithSides()}
  {@render ContextMenuWithShortcuts()}
  {@render ContextMenuWithSubmenu()}
  {@render ContextMenuWithGroups()}
  {@render ContextMenuWithCheckboxes()}
  {@render ContextMenuWithRadio()}
  {@render ContextMenuWithDestructive()}
  {@render ContextMenuInDialog()}
  {@render ContextMenuWithInset()}
</ExampleWrapper>
