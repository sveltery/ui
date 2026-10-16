<script lang="ts">
  import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarTrigger } from '@sveltery/components/menubar';

  let user = $state('benoit');
  let theme = $state('system');
</script>

<Menubar class="w-72">
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
      <MenubarRadioGroup bind:value={theme}>
        <MenubarRadioItem value="light">Light</MenubarRadioItem>
        <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
        <MenubarRadioItem value="system">System</MenubarRadioItem>
      </MenubarRadioGroup>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
