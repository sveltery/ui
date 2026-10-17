<script lang="ts">
  import FileIcon from '@lucide/svelte/icons/file';
  import FolderIcon from '@lucide/svelte/icons/folder';
  import HelpCircleIcon from '@lucide/svelte/icons/circle-help';
  import SaveIcon from '@lucide/svelte/icons/save';
  import SettingsIcon from '@lucide/svelte/icons/settings';
  import TrashIcon from '@lucide/svelte/icons/trash';
  import { Menubar, MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '$registry/bases/base/ui/menubar';
</script>

<Menubar class="w-72">
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        <FileIcon />
        New File <MenubarShortcut>⌘N</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>
        <FolderIcon />
        Open Folder
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem>
        <SaveIcon />
        Save <MenubarShortcut>⌘S</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>More</MenubarTrigger>
    <MenubarContent>
      <MenubarGroup>
        <MenubarItem>
          <SettingsIcon />
          Settings
        </MenubarItem>
        <MenubarItem>
          <HelpCircleIcon />
          Help
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem variant="destructive">
          <TrashIcon />
          Delete
        </MenubarItem>
      </MenubarGroup>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
