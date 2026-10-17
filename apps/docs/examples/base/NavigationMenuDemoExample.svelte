<script lang="ts">
  import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
  import CircleDashedIcon from '@lucide/svelte/icons/circle-dashed';
  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
  } from '$registry/bases/base/ui/navigation-menu';

  const components: { title: string; href: string; description: string }[] = [
    {
      title: 'Alert Dialog',
      href: '/docs/components/alert-dialog',
      description: 'A modal dialog that interrupts the user with important content and expects a response.'
    },
    {
      title: 'Hover Card',
      href: '/docs/components/hover-card',
      description: 'For sighted users to preview content available behind a link.'
    },
    {
      title: 'Progress',
      href: '/docs/components/progress',
      description: 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.'
    },
    {
      title: 'Scroll-area',
      href: '/docs/components/scroll-area',
      description: 'Visually or semantically separates content.'
    },
    {
      title: 'Tabs',
      href: '/docs/components/tabs',
      description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.'
    },
    {
      title: 'Tooltip',
      href: '/docs/components/tooltip',
      description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.'
    }
  ];
</script>

{#snippet ListItem(title: string, href: string, description: string)}
  <li>
    <NavigationMenuLink {href}>
      <div class="flex flex-col gap-1 text-sm">
        <div class="leading-none font-medium">{title}</div>
        <div class="line-clamp-2 text-muted-foreground">{description}</div>
      </div>
    </NavigationMenuLink>
  </li>
{/snippet}

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul class="w-96">
          {@render ListItem('Introduction', '/docs', 'Re-usable components built with Tailwind CSS.')}
          {@render ListItem('Installation', '/docs/installation', 'How to install dependencies and structure your app.')}
          {@render ListItem('Typography', '/docs/typeset', 'Styles for headings, paragraphs, lists...etc')}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem class="hidden md:flex">
      <NavigationMenuTrigger>Components</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul class="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          {#each components as component (component.title)}
            {@render ListItem(component.title, component.href, component.description)}
          {/each}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul class="grid w-[200px]">
          <li>
            <NavigationMenuLink href="#" class="flex-row items-center gap-2">
              <CircleAlertIcon />
              Backlog
            </NavigationMenuLink>
            <NavigationMenuLink href="#" class="flex-row items-center gap-2">
              <CircleDashedIcon />
              To Do
            </NavigationMenuLink>
            <NavigationMenuLink href="#" class="flex-row items-center gap-2">
              <CircleCheckIcon />
              Done
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/docs" class={navigationMenuTriggerStyle()}>Docs</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
