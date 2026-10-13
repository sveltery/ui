<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@sveltery/ui/navigation-menu';

  const components: { title: string; description: string }[] = [
    { title: 'Alert Dialog', description: 'A modal dialog that interrupts the user with important content and expects a response.' },
    { title: 'Hover Card', description: 'For sighted users to preview content available behind a link.' },
    { title: 'Progress', description: 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.' },
    { title: 'Scroll-area', description: 'Visually or semantically separates content.' },
    { title: 'Tabs', description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.' },
    { title: 'Tooltip', description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.' },
  ];
</script>

{#snippet ListItem(title: string, description: string)}
  <li>
    <NavigationMenuLink href="#">
      <div class="flex flex-col gap-1 style-vega:text-sm style-nova:text-sm style-lyra:text-xs style-maia:text-sm style-mira:text-xs style-luma:text-sm">
        <div class="leading-none font-medium">{title}</div>
        <div class="line-clamp-2 text-muted-foreground">{description}</div>
      </div>
    </NavigationMenuLink>
  </li>
{/snippet}

{#snippet NavigationMenuBasic()}
  <Example title="Basic">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="w-96">
              {@render ListItem('Introduction', 'Re-usable components built with Tailwind CSS.')}
              {@render ListItem('Installation', 'How to install dependencies and structure your app.')}
              {@render ListItem('Typography', 'Styles for headings, paragraphs, lists...etc')}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {#each components as component (component.title)}
                {@render ListItem(component.title, component.description)}
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
                  <IconPlaceholder lucide="CircleAlertIcon" tabler="IconExclamationCircle" hugeicons="AlertCircleIcon" phosphor="WarningCircleIcon" remixicon="RiErrorWarningLine" />
                  Backlog
                </NavigationMenuLink>
                <NavigationMenuLink href="#" class="flex-row items-center gap-2">
                  <IconPlaceholder lucide="CircleAlertIcon" tabler="IconExclamationCircle" hugeicons="AlertCircleIcon" phosphor="WarningCircleIcon" remixicon="RiErrorWarningLine" />
                  To Do
                </NavigationMenuLink>
                <NavigationMenuLink href="#" class="flex-row items-center gap-2">
                  <IconPlaceholder lucide="CircleAlertIcon" tabler="IconExclamationCircle" hugeicons="AlertCircleIcon" phosphor="WarningCircleIcon" remixicon="RiErrorWarningLine" />
                  Done
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" class={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </Example>
{/snippet}

<ExampleWrapper class="lg:grid-cols-1">
  {@render NavigationMenuBasic()}
</ExampleWrapper>
