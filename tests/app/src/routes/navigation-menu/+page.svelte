<script lang="ts">
  import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@sveltery/ui/navigation-menu';
  let value = $state<string | null>(null);
  let menu: ReturnType<typeof NavigationMenu>;
</script>
<svelte:window onkeydown={(event) => { if (event.key === 'c') menu.close(); }} />
<div class="flex flex-col items-start gap-8 p-16">
  <NavigationMenu bind:this={menu} bind:value>
    <NavigationMenuList>
      <NavigationMenuItem value="getting-started">
        <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="w-96">
            <li><NavigationMenuLink href="#introduction">Introduction</NavigationMenuLink></li>
            <li><NavigationMenuLink href="#installation">Installation</NavigationMenuLink></li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="components">
        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="w-96">
            <li><NavigationMenuLink href="#tabs">Tabs</NavigationMenuLink></li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#docs" active class={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
  <output>{value ?? 'closed'}</output>
  <button type="button" onclick={() => (value = 'components')}>Open Components</button>
  <button type="button">Elsewhere</button>
</div>
