<script lang="ts">
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Menubar, MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '$registry/bases/base/ui/menubar';
</script>

<Menubar class="w-72">
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
          <IconPlaceholder lucide="SettingsIcon" tabler="IconSettings" hugeicons="SettingsIcon" phosphor="GearIcon" remixicon="RiSettingsLine" />
          Settings
        </MenubarItem>
        <MenubarItem>
          <IconPlaceholder lucide="HelpCircleIcon" tabler="IconHelpCircle" hugeicons="HelpCircleIcon" phosphor="QuestionIcon" remixicon="RiQuestionLine" />
          Help
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem variant="destructive">
          <IconPlaceholder lucide="TrashIcon" tabler="IconTrash" hugeicons="DeleteIcon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
          Delete
        </MenubarItem>
      </MenubarGroup>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
