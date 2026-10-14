<script lang="ts">
  import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger
  } from '@sveltery/ui/menubar';

  let last = $state('none');
  let grid = $state(true);
  let profile = $state('benoit');
</script>
<div class="p-16">
  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onclick={() => (last = 'New Tab')}>New Tab<MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
        <MenubarItem disabled>New Incognito Window</MenubarItem>
        <MenubarSeparator />
        <MenubarSub>
          <MenubarSubTrigger>Share</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem onclick={() => (last = 'Email link')}>Email link</MenubarItem>
            <MenubarItem onclick={() => (last = 'Messages')}>Messages</MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem variant="destructive" onclick={() => (last = 'Delete')}>Delete</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onclick={() => (last = 'Undo')}>Undo</MenubarItem>
        <MenubarItem onclick={() => (last = 'Redo')}>Redo</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarCheckboxItem bind:checked={grid}>Show Grid</MenubarCheckboxItem>
        <MenubarSeparator />
        <MenubarRadioGroup bind:value={profile}>
          <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
          <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
          <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
  <output>Last: {last}; Grid: {grid}; Profile: {profile}</output>
</div>
