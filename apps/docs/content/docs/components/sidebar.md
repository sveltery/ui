---
title: Sidebar
description: A composable, themeable and customizable sidebar component.
---

<figure class="flex flex-col gap-4">
  <ComponentPreview name="base/SidebarDemoExample" />
  <figcaption class="text-center text-sm text-gray-500">A sidebar that collapses to icons.</figcaption>
</figure>

Sidebars are one of the most complex components to build. They are central to any application and often contain a lot of moving parts.

We now have a solid foundation to build on top of. Composable. Themeable. Customizable.

[Browse the Blocks Library](/blocks).

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add sidebar
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/sidebar`.

<ComponentSource name="sidebar" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter, SidebarInset, SidebarProvider, SidebarTrigger } from '#lib/components/ui/sidebar';
</script>
```

Wrap the page in `SidebarProvider`. Put the `Sidebar` and the page content, in `SidebarInset`, side by side inside it. Put a `SidebarTrigger` anywhere inside the provider.

```svelte
<SidebarProvider>
  <Sidebar>
    <SidebarHeader />
    <SidebarContent>
      <SidebarGroup />
      <SidebarGroup />
    </SidebarContent>
    <SidebarFooter />
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {@render children?.()}
  </SidebarInset>
</SidebarProvider>
```

## Composition

Use the following composition to build a `Sidebar` layout:

```text
SidebarProvider
├── Sidebar
│   ├── SidebarHeader
│   ├── SidebarContent
│   │   ├── SidebarGroup
│   │   │   ├── SidebarGroupLabel
│   │   │   ├── SidebarGroupAction
│   │   │   ├── SidebarGroupContent
│   │   │   └── SidebarMenu
│   │   │       ├── SidebarMenuItem
│   │   │       │   ├── SidebarMenuButton
│   │   │       │   ├── SidebarMenuAction
│   │   │       │   └── SidebarMenuBadge
│   │   │       └── SidebarMenuItem
│   │   │           ├── SidebarMenuButton
│   │   │           └── SidebarMenuSub
│   │   │               ├── SidebarMenuSubItem
│   │   │               └── SidebarMenuSubItem
│   │   └── SidebarGroup
│   │       └── SidebarMenu
│   │           ├── SidebarMenuItem
│   │           └── SidebarMenuItem
│   ├── SidebarFooter
│   └── SidebarRail
├── SidebarInset
└── SidebarTrigger
```

## Structure

- **SidebarProvider** — Handles collapsible state and provides sidebar context to child components.
- **Sidebar** — The main collapsible sidebar panel.
- **SidebarHeader** — Sticky at the top; use for branding, titles, or workspace switchers.
- **SidebarFooter** — Sticky at the bottom; use for user menus, settings, or actions.
- **SidebarContent** — Scrollable region between the header and footer.
- **SidebarGroup** — Groups related navigation with optional label, action, and content areas.
- **SidebarMenu** / **SidebarMenuItem** — Menu structure for links, badges, actions, and nested submenus.
- **SidebarRail** — Resize handle for adjusting sidebar width when applicable.
- **SidebarInset** — Wraps main content when using the `inset` variant.
- **SidebarTrigger** — Control that toggles the sidebar open or collapsed.

<img
  src="/images/sidebar-structure.png"
  width="716"
  height="420"
  alt="Sidebar Structure"
  class="mt-6 w-full overflow-hidden rounded-2xl border dark:hidden"
/>
<img
  src="/images/sidebar-structure-dark.png"
  width="716"
  height="420"
  alt="Sidebar Structure"
  class="mt-6 hidden w-full overflow-hidden rounded-2xl border dark:block"
/>

## SidebarProvider

The `SidebarProvider` component is used to provide the sidebar context to the `Sidebar` component. You should always wrap your application in a `SidebarProvider` component.

### Props

| Name           | Type                      | Description                                                                  |
| -------------- | ------------------------- | ---------------------------------------------------------------------------- |
| `defaultOpen`  | `boolean`                 | Default open state of the sidebar.                                           |
| `open`         | `boolean`                 | Open state of the sidebar. Use `bind:open` to control it.                    |
| `onOpenChange` | `(open: boolean) => void` | Runs when the open state of the sidebar changes.                             |

### Width

If you have a single sidebar in your application, you can use the `SIDEBAR_WIDTH` and `SIDEBAR_WIDTH_MOBILE` variables in `sidebar/constants.ts` to set the width of the sidebar.

```ts title="src/lib/components/ui/sidebar/constants.ts"
export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
```

For multiple sidebars in your application, you can use the `--sidebar-width` CSS variable in the `style` prop.

```svelte
<SidebarProvider style="--sidebar-width: 20rem;">
  <Sidebar />
</SidebarProvider>
```

`--sidebar-width-icon` (`3rem`) sets the width of the sidebar in `icon` mode. The mobile sheet always uses `SIDEBAR_WIDTH_MOBILE`.

### Keyboard Shortcut

To trigger the sidebar, you use the `cmd+b` keyboard shortcut on Mac and `ctrl+b` on Windows. It works from anywhere on the page, including while a field has focus.

```ts title="src/lib/components/ui/sidebar/constants.ts"
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';
```

## Sidebar

The main `Sidebar` component used to render a collapsible sidebar.

### Props

| Property      | Type                              | Description                       |
| ------------- | --------------------------------- | --------------------------------- |
| `side`        | `left` or `right`                 | The side of the sidebar.          |
| `variant`     | `sidebar`, `floating`, or `inset` | The variant of the sidebar.       |
| `collapsible` | `offcanvas`, `icon`, or `none`    | Collapsible state of the sidebar. |

| Prop        | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `offcanvas` | A collapsible sidebar that slides in from the left or right. |
| `icon`      | A sidebar that collapses to icons.                           |
| `none`      | A non-collapsible sidebar.                                   |

<Callout>
  **Note:** If you use the `inset` variant, remember to wrap your main content in a `SidebarInset` component.
</Callout>

```svelte
<SidebarProvider>
  <Sidebar variant="inset" />
  <SidebarInset>
    <main>{@render children?.()}</main>
  </SidebarInset>
</SidebarProvider>
```

Below 768 px wide, the sidebar becomes a `Sheet` that `SidebarTrigger` opens. The `offcanvas` and `icon` modes behave the same there.

## useSidebar

The `useSidebar` hook is used to control the sidebar. Call it during component initialization, inside the provider. The object it returns is live.

```svelte
<script lang="ts">
  import { useSidebar } from '#lib/components/ui/sidebar';

  const sidebar = useSidebar();
  // sidebar.state, sidebar.open, sidebar.setOpen, sidebar.openMobile,
  // sidebar.setOpenMobile, sidebar.isMobile, sidebar.toggleSidebar
</script>
```

| Property        | Type                      | Description                                   |
| --------------- | ------------------------- | --------------------------------------------- |
| `state`         | `expanded` or `collapsed` | The current state of the sidebar.             |
| `open`          | `boolean`                 | Whether the sidebar is open.                  |
| `setOpen`       | `(open: boolean) => void` | Sets the open state of the sidebar.           |
| `openMobile`    | `boolean`                 | Whether the sidebar is open on mobile.        |
| `setOpenMobile` | `(open: boolean) => void` | Sets the open state of the sidebar on mobile. |
| `isMobile`      | `boolean`                 | Whether the sidebar is on mobile.             |
| `toggleSidebar` | `() => void`              | Toggles the sidebar. Desktop and mobile.      |

## SidebarHeader

Use the `SidebarHeader` component to add a sticky header to the sidebar.

```svelte
<Sidebar>
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {#snippet render(props, state, children)}
              <SidebarMenuButton {...props}>{@render children?.()}</SidebarMenuButton>
            {/snippet}
            Select Workspace
            <ChevronDown class="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <span>Acme Inc</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
</Sidebar>
```

## SidebarFooter

Use the `SidebarFooter` component to add a sticky footer to the sidebar.

```svelte
<Sidebar>
  <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <User2 /> Username
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
</Sidebar>
```

## SidebarContent

The `SidebarContent` component is used to wrap the content of the sidebar. This is where you add your `SidebarGroup` components. It is scrollable.

```svelte
<Sidebar>
  <SidebarContent>
    <SidebarGroup />
    <SidebarGroup />
  </SidebarContent>
</Sidebar>
```

## SidebarGroup

Use the `SidebarGroup` component to create a section within the sidebar.

A `SidebarGroup` has a `SidebarGroupLabel`, a `SidebarGroupContent` and an optional `SidebarGroupAction`.

```svelte
<SidebarGroup>
  <SidebarGroupLabel>Application</SidebarGroupLabel>
  <SidebarGroupAction>
    <Plus /> <span class="sr-only">Add Project</span>
  </SidebarGroupAction>
  <SidebarGroupContent></SidebarGroupContent>
</SidebarGroup>
```

`SidebarGroupLabel` and `SidebarGroupAction` take a `render` snippet. In this example, the group action calls `toast.add()`.

<ComponentPreview name="base/SidebarGroupActionExample" />

To make a `SidebarGroup` collapsible, wrap it in a `Collapsible`.

```svelte
<Collapsible open class="group/collapsible">
  <SidebarGroup>
    <SidebarGroupLabel>
      {#snippet render(props, state, children)}
        <CollapsibleTrigger {...props}>{@render children?.()}</CollapsibleTrigger>
      {/snippet}
      Help
      <ChevronDown class="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
    </SidebarGroupLabel>
    <CollapsibleContent>
      <SidebarGroupContent />
    </CollapsibleContent>
  </SidebarGroup>
</Collapsible>
```

## SidebarMenu

The `SidebarMenu` component is used for building a menu within a `SidebarGroup`.

<img
  src="/images/sidebar-menu.png"
  width="716"
  height="420"
  alt="Sidebar Menu"
  class="mt-6 w-full overflow-hidden rounded-2xl border dark:hidden"
/>
<img
  src="/images/sidebar-menu-dark.png"
  width="716"
  height="420"
  alt="Sidebar Menu"
  class="mt-6 hidden w-full overflow-hidden rounded-2xl border dark:block"
/>

```svelte
<SidebarMenu>
  {#each projects as project (project.name)}
    <SidebarMenuItem>
      <SidebarMenuButton>
        {#snippet render(props, state, children)}
          <a href={project.url} {...props}>{@render children?.()}</a>
        {/snippet}
        <project.icon />
        <span>{project.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  {/each}
</SidebarMenu>
```

## SidebarMenuButton

The `SidebarMenuButton` component is used to render a menu button within a `SidebarMenuItem`.

By default, the `SidebarMenuButton` renders a button but you can use the `render` snippet to render a different component such as a link or an `a` tag. Spread the snippet's props onto the element and render `children`.

Use the `isActive` prop to mark a menu item as active.

```svelte
{#snippet link(props, state, children)}
  <a href="/" {...props}>{@render children?.()}</a>
{/snippet}

<SidebarMenuButton render={link} isActive>
  Home
</SidebarMenuButton>
```

In `icon` mode, `tooltip` shows a label beside the icon. It takes a string or the props of `TooltipContent`.

```svelte
<SidebarMenuButton tooltip="Home">
  <Home />
  <span>Home</span>
</SidebarMenuButton>
```

## SidebarMenuAction

The `SidebarMenuAction` component is used to render a menu action within a `SidebarMenuItem`. It takes a `render` snippet and `showOnHover`.

```svelte
<SidebarMenuItem>
  <SidebarMenuButton>
    {#snippet render(props, state, children)}
      <a href="/" {...props}>{@render children?.()}</a>
    {/snippet}
    <Home />
    <span>Home</span>
  </SidebarMenuButton>
  <SidebarMenuAction>
    <Plus /> <span class="sr-only">Add Project</span>
  </SidebarMenuAction>
</SidebarMenuItem>
```

## SidebarMenuSub

The `SidebarMenuSub` component is used to render a submenu within a `SidebarMenu`. `SidebarMenuSubButton` renders an `<a>` and takes a `render` snippet and `isActive`.

```svelte
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuSub>
    <SidebarMenuSubItem>
      <SidebarMenuSubButton />
    </SidebarMenuSubItem>
  </SidebarMenuSub>
</SidebarMenuItem>
```

## SidebarMenuBadge

The `SidebarMenuBadge` component is used to render a badge within a `SidebarMenuItem`.

```svelte
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuBadge>24</SidebarMenuBadge>
</SidebarMenuItem>
```

## SidebarMenuSkeleton

The `SidebarMenuSkeleton` component is used to render a skeleton for a `SidebarMenu`.

```svelte
<SidebarMenu>
  {#each Array.from({ length: 5 }) as _, index (index)}
    <SidebarMenuItem>
      <SidebarMenuSkeleton />
    </SidebarMenuItem>
  {/each}
</SidebarMenu>
```

## SidebarTrigger

Use the `SidebarTrigger` component to render a button that toggles the sidebar.

```svelte
<script lang="ts">
  import { useSidebar } from '#lib/components/ui/sidebar';

  const sidebar = useSidebar();
</script>

<button onclick={sidebar.toggleSidebar}>Toggle Sidebar</button>
```

## SidebarRail

The `SidebarRail` component is used to render a rail within a `Sidebar`. This rail can be used to toggle the sidebar.

```svelte
<Sidebar>
  <SidebarHeader />
  <SidebarContent>
    <SidebarGroup />
  </SidebarContent>
  <SidebarFooter />
  <SidebarRail />
</Sidebar>
```

## Controlled Sidebar

Use `bind:open` and `onOpenChange` to control the sidebar.

```svelte
<script lang="ts">
  let open = $state(false);
</script>

<SidebarProvider bind:open>
  <Sidebar />
</SidebarProvider>
```

### Persisting the state

Every change writes the `sidebar_state` cookie, which lasts a week. Read it on the server and pass it as `defaultOpen`, so the sidebar renders in the same state after a reload.

```ts title="+layout.server.ts"
export function load({ cookies }) {
  return { sidebarOpen: cookies.get('sidebar_state') !== 'false' };
}
```

```svelte title="+layout.svelte"
<SidebarProvider defaultOpen={data.sidebarOpen}>…</SidebarProvider>
```

## Theming

We use the following CSS variables to theme the sidebar.

```css
:root {
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}
```

## Styling

Here are some tips for styling the sidebar based on different states.

```svelte
<Sidebar collapsible="icon">
  <SidebarContent>
    <SidebarGroup class="group-data-[collapsible=icon]:hidden" />
  </SidebarContent>
</Sidebar>
```

```svelte
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuAction class="peer-data-[active=true]/menu-button:opacity-100" />
</SidebarMenuItem>
```

## RTL

Wrap the sidebar in a [DirectionProvider](/docs/components/direction), then set `dir` on `Sidebar` and `side` to match. Use the buttons to switch the language.

<ComponentPreview name="base/SidebarRtlExample" />

## Changelog

### RTL Support

If you're upgrading from a previous version of the `Sidebar` component, you'll need to apply the following updates to add RTL support:

<Steps>

### Add `dir` prop to Sidebar component.

Add `dir` to the destructured props and pass it to `SheetContent` for mobile:

```diff
- let { side = 'left', variant = 'sidebar', collapsible = 'offcanvas', children, class: classProp, ...props }: SidebarProps = $props();
+ let { side = 'left', variant = 'sidebar', collapsible = 'offcanvas', children, class: classProp, dir, ...props }: SidebarProps = $props();
```

Then pass it to `SheetContent` in the mobile view:

```diff
  <Sheet open={sidebar.openMobile} onOpenChange={sidebar.setOpenMobile}>
-   <SheetContent data-sidebar="sidebar" data-slot="sidebar" data-mobile="true" {side}>
+   <SheetContent {dir} data-sidebar="sidebar" data-slot="sidebar" data-mobile="true" {side}>
```

### Add `data-side` attribute to sidebar container.

Add `data-side={side}` to the sidebar container element:

```diff
  <div
    data-slot="sidebar-container"
+   data-side={side}
```

### Update sidebar container positioning classes.

Replace JavaScript ternary conditional classes with CSS data attribute selectors:

```diff
  class={cn(
-   'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
-   side === 'left'
-     ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
-     : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
+   'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex data-[side=left]:left-0 data-[side=right]:right-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
```

### Update SidebarRail positioning classes.

Update the `SidebarRail` component to use physical positioning for the rail:

```diff
  class={cn(
-   'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-end-4 group-data-[side=right]:start-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex',
+   'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 ltr:-translate-x-1/2 rtl:-translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex',
```

### Add RTL flip to SidebarTrigger icon.

Add `class="cn-rtl-flip"` to the icon in `SidebarTrigger` to flip it in RTL mode:

```diff
  <Button ...>
-   <PanelLeftIcon />
+   <PanelLeftIcon class="cn-rtl-flip" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
```

</Steps>

After applying these changes, you can use the `dir` prop to set the direction:

```svelte
<Sidebar dir="rtl" side="right">
  <!-- ... -->
</Sidebar>
```

The sidebar will correctly position itself and handle interactions in both LTR and RTL layouts.

## API Reference

`Sidebar` has no Base primitive of its own. On mobile it is a `Sheet`, styled on the Sveltery Base `Dialog` primitive, and `SidebarMenuButton` shows its `tooltip` with a `Tooltip`, styled on the Sveltery Base `Tooltip` primitive. Both own their behavior, focus handling and accessibility. See the [Base UI Dialog](https://base-ui.com/react/components/dialog) and [Base UI Tooltip](https://base-ui.com/react/components/tooltip) documentation for the behavior they port.
