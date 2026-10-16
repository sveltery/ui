<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Button } from '$registry/bases/base/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '$registry/bases/base/ui/dialog';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger
  } from '$registry/bases/base/ui/menubar';

  const sides = ['inline-start', 'left', 'top', 'bottom', 'right', 'inline-end'] as const;

  let user = $state('benoit');
  let radioTheme = $state('system');
  let showBookmarks = $state(true);
  let showUrls = $state(false);
  let theme = $state('system');
</script>

{#snippet MenubarBasic()}
  <Example title="Basic">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Example>
{/snippet}

{#snippet MenubarSides()}
  <Example title="Sides" containerClass="col-span-2">
    <div class="flex flex-wrap justify-center gap-2">
      {#each sides as side (side)}
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger class="capitalize">{side.replace('-', ' ')}</MenubarTrigger>
            <MenubarContent {side}>
              <MenubarGroup>
                <MenubarItem>New Tab</MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarItem>New Incognito Window</MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet MenubarWithSubmenu()}
  <Example title="With Submenu">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Example>
{/snippet}

{#snippet MenubarWithCheckboxes()}
  <Example title="With Checkboxes">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent class="w-64">
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>Strikethrough</MenubarCheckboxItem>
          <MenubarCheckboxItem>Code</MenubarCheckboxItem>
          <MenubarCheckboxItem>Superscript</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Example>
{/snippet}

{#snippet MenubarWithRadio()}
  <Example title="With Radio">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup bind:value={user}>
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit...</MenubarItem>
          <MenubarItem inset>Add Profile...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Theme</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup bind:value={radioTheme}>
            <MenubarRadioItem value="light">Light</MenubarRadioItem>
            <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
            <MenubarRadioItem value="system">System</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Example>
{/snippet}

{#snippet MenubarWithIcons()}
  <Example title="With Icons">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <IconPlaceholder lucide="FileIcon" tabler="IconFile" hugeicons="FileIcon" phosphor="FileIcon" remixicon="RiFileLine" />
            New File <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <IconPlaceholder lucide="FolderIcon" tabler="IconFolder" hugeicons="FolderIcon" phosphor="FolderIcon" remixicon="RiFolderLine" />
            Open Folder
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <IconPlaceholder lucide="SaveIcon" tabler="IconDeviceFloppy" hugeicons="FloppyDiskIcon" phosphor="FloppyDiskIcon" remixicon="RiSaveLine" />
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>More</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <IconPlaceholder lucide="CircleDashedIcon" tabler="IconCircleDashed" hugeicons="DashedLineCircleIcon" phosphor="CircleDashedIcon" remixicon="RiLoaderLine" />
              Settings
            </MenubarItem>
            <MenubarItem>
              <IconPlaceholder lucide="CircleDashedIcon" tabler="IconCircleDashed" hugeicons="DashedLineCircleIcon" phosphor="CircleDashedIcon" remixicon="RiLoaderLine" />
              Help
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              <IconPlaceholder lucide="CircleDashedIcon" tabler="IconCircleDashed" hugeicons="DashedLineCircleIcon" phosphor="CircleDashedIcon" remixicon="RiLoaderLine" />
              Delete
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Example>
{/snippet}

{#snippet MenubarWithShortcuts()}
  <Example title="With Shortcuts">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Example>
{/snippet}

{#snippet MenubarFormat()}
  <Example title="Format">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <IconPlaceholder lucide="BoldIcon" tabler="IconBold" hugeicons="TextBoldIcon" phosphor="TextBIcon" remixicon="RiBold" />
            Bold <MenubarShortcut>⌘B</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <IconPlaceholder lucide="ItalicIcon" tabler="IconItalic" hugeicons="TextItalicIcon" phosphor="TextItalicIcon" remixicon="RiItalic" />
            Italic <MenubarShortcut>⌘I</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <IconPlaceholder lucide="UnderlineIcon" tabler="IconUnderline" hugeicons="TextUnderlineIcon" phosphor="TextUnderlineIcon" remixicon="RiUnderline" />
            Underline <MenubarShortcut>⌘U</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarCheckboxItem checked>Strikethrough</MenubarCheckboxItem>
          <MenubarCheckboxItem>Code</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Show Ruler</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Show Grid</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>Zoom In</MenubarItem>
          <MenubarItem inset>Zoom Out</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Example>
{/snippet}

{#snippet MenubarInsert()}
  <Example title="Insert">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Insert</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>
              <IconPlaceholder lucide="ImageIcon" tabler="IconPhoto" hugeicons="ImageIcon" phosphor="ImageIcon" remixicon="RiImageLine" />
              Media
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Image</MenubarItem>
              <MenubarItem>Video</MenubarItem>
              <MenubarItem>Audio</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <IconPlaceholder lucide="LinkIcon" tabler="IconLink" hugeicons="LinkIcon" phosphor="LinkIcon" remixicon="RiLinksLine" />
            Link <MenubarShortcut>⌘K</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <IconPlaceholder lucide="TableIcon" tabler="IconTable" hugeicons="TableIcon" phosphor="TableIcon" remixicon="RiTableLine" />
            Table
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Tools</MenubarTrigger>
        <MenubarContent class="w-44">
          <MenubarItem>
            <IconPlaceholder lucide="SearchIcon" tabler="IconSearch" hugeicons="SearchIcon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" />
            Find & Replace <MenubarShortcut>⌘F</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" />
            Spell Check
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Example>
{/snippet}

{#snippet MenubarDestructive()}
  <Example title="Destructive">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent class="w-40">
          <MenubarItem>
            <IconPlaceholder lucide="FileIcon" tabler="IconFile" hugeicons="FileIcon" phosphor="FileIcon" remixicon="RiFileLine" />
            New File <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <IconPlaceholder lucide="FolderIcon" tabler="IconFolder" hugeicons="FolderIcon" phosphor="FolderIcon" remixicon="RiFolderLine" />
            Open Folder
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <IconPlaceholder lucide="TrashIcon" tabler="IconTrash" hugeicons="DeleteIcon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
            Delete File <MenubarShortcut>⌘⌫</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Account</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <IconPlaceholder lucide="UserIcon" tabler="IconUser" hugeicons="UserIcon" phosphor="UserIcon" remixicon="RiUserLine" />
            Profile
          </MenubarItem>
          <MenubarItem>
            <IconPlaceholder lucide="SettingsIcon" tabler="IconSettings" hugeicons="SettingsIcon" phosphor="GearIcon" remixicon="RiSettingsLine" />
            Settings
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <IconPlaceholder lucide="LogOutIcon" tabler="IconLogout" hugeicons="LogoutIcon" phosphor="SignOutIcon" remixicon="RiLogoutBoxLine" />
            Sign out
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <IconPlaceholder lucide="TrashIcon" tabler="IconTrash" hugeicons="DeleteIcon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Example>
{/snippet}

{#snippet MenubarInDialog()}
  <Example title="In Dialog">
    <Dialog>
      <DialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Open Dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Menubar Example</DialogTitle>
          <DialogDescription>Use the menubar below to see the menu options.</DialogDescription>
        </DialogHeader>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="CopyIcon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />
                Copy
              </MenubarItem>
              <MenubarItem>
                <IconPlaceholder lucide="ScissorsIcon" tabler="IconCut" hugeicons="ScissorIcon" phosphor="ScissorsIcon" remixicon="RiScissorsLine" />
                Cut
              </MenubarItem>
              <MenubarItem>
                <IconPlaceholder lucide="ClipboardPasteIcon" tabler="IconClipboard" hugeicons="ClipboardIcon" phosphor="ClipboardIcon" remixicon="RiClipboardLine" />
                Paste
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>More Options</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Save Page...</MenubarItem>
                  <MenubarItem>Create Shortcut...</MenubarItem>
                  <MenubarItem>Name Window...</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Developer Tools</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem variant="destructive">
                <IconPlaceholder lucide="TrashIcon" tabler="IconTrash" hugeicons="DeleteIcon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
                Delete
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

{#snippet MenubarWithInset()}
  <Example title="With Inset">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent class="w-44">
          <MenubarGroup>
            <MenubarLabel>Actions</MenubarLabel>
            <MenubarItem>
              <IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="CopyIcon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />
              Copy
            </MenubarItem>
            <MenubarItem>
              <IconPlaceholder lucide="ScissorsIcon" tabler="IconCut" hugeicons="ScissorIcon" phosphor="ScissorsIcon" remixicon="RiScissorsLine" />
              Cut
            </MenubarItem>
            <MenubarItem inset>Paste</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarLabel inset>Appearance</MenubarLabel>
            <MenubarCheckboxItem inset bind:checked={showBookmarks}>Bookmarks</MenubarCheckboxItem>
            <MenubarCheckboxItem inset bind:checked={showUrls}>Full URLs</MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarLabel inset>Theme</MenubarLabel>
            <MenubarRadioGroup bind:value={theme}>
              <MenubarRadioItem inset value="light">Light</MenubarRadioItem>
              <MenubarRadioItem inset value="dark">Dark</MenubarRadioItem>
              <MenubarRadioItem inset value="system">System</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger inset>More Options</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarGroup>
                <MenubarItem>Save Page...</MenubarItem>
                <MenubarItem>Create Shortcut...</MenubarItem>
              </MenubarGroup>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render MenubarBasic()}
  {@render MenubarWithSubmenu()}
  {@render MenubarSides()}
  {@render MenubarWithCheckboxes()}
  {@render MenubarWithRadio()}
  {@render MenubarWithIcons()}
  {@render MenubarWithShortcuts()}
  {@render MenubarFormat()}
  {@render MenubarInsert()}
  {@render MenubarDestructive()}
  {@render MenubarInDialog()}
  {@render MenubarWithInset()}
</ExampleWrapper>
