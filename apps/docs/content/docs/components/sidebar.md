---
title: Sidebar
description: A composable, themeable and customizable sidebar component.
---

<ComponentPreview name="base/SidebarExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/sidebar`.

<ComponentSource name="sidebar" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter, SidebarInset, SidebarProvider, SidebarTrigger } from '$lib/components/ui/sidebar';
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

A menu is a `SidebarMenu` of `SidebarMenuItem`s. Each item holds a `SidebarMenuButton`, which renders a `<button>`. To render a link, pass a `render` snippet, spread its props onto the element and render `children`. `isActive` marks the current page.

```svelte
{#snippet link(props, state, children)}
  <a href="/inbox" {...props}>{@render children?.()}</a>
{/snippet}

<SidebarMenu>
  <SidebarMenuItem>
    <SidebarMenuButton render={link} isActive tooltip="Inbox">
      <InboxIcon />
      <span>Inbox</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
</SidebarMenu>
```

`SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`, `SidebarMenuSkeleton`, `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarInput`, `SidebarSeparator` and `SidebarRail` follow the same anatomy as the upstream shadcn/ui sidebar. `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarMenuAction` and `SidebarMenuSubButton` also take a `render` snippet.

## Collapsible modes

`Sidebar` takes `collapsible`.

| Value | Behavior |
| --- | --- |
| `offcanvas` | The sidebar slides out of view. This is the default |
| `icon` | The sidebar shrinks to a strip of icons. `SidebarMenuButton` shows its `tooltip` beside the icon |
| `none` | The sidebar cannot collapse |

```svelte
<Sidebar collapsible="icon">…</Sidebar>
```

`side` is `left` or `right`, and `variant` is `sidebar`, `floating` or `inset`. Use `inset` together with `SidebarInset`.

Below 768 px wide, the sidebar becomes a `Sheet` that `SidebarTrigger` opens. The `offcanvas` and `icon` modes behave the same there.

## Controlled state

Bind `open` on `SidebarProvider` to read and set the desktop state. `defaultOpen` sets the initial state when you do not bind it, and `onOpenChange` runs on every change.

```svelte
<script lang="ts">
  let open = $state(true);
</script>

<SidebarProvider bind:open>…</SidebarProvider>
```

Inside the provider, `useSidebar()` returns the live state. Read it during component initialization.

```svelte
<script lang="ts">
  import { useSidebar } from '$lib/components/ui/sidebar';
  const sidebar = useSidebar();
</script>

<button onclick={sidebar.toggleSidebar}>{sidebar.state}</button>
```

| Property | Type |
| --- | --- |
| `state` | `'expanded' \| 'collapsed'` |
| `open`, `setOpen(open)` | The desktop state |
| `openMobile`, `setOpenMobile(open)` | The state of the mobile sheet |
| `isMobile` | `true` below 768 px |
| `toggleSidebar()` | Toggles the sheet on mobile and the sidebar elsewhere |

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

## Keyboard shortcut

`Ctrl+B` and `Cmd+B` toggle the sidebar from anywhere on the page, including while a field has focus.

## Width

`SidebarProvider` sets `--sidebar-width` (`16rem`) and `--sidebar-width-icon` (`3rem`). Override them with `style` on the provider. The mobile sheet is `18rem` wide.

```svelte
<SidebarProvider style="--sidebar-width: 20rem;">…</SidebarProvider>
```

## Theming

The sidebar reads the `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border` and `--sidebar-ring` variables from your theme.

## Examples

The upstream examples open dropdown menus from the team switcher, the user menu and the floating navigation. Those menus wait for the Menu component, so here the triggers are plain `SidebarMenuButton`s.

### Floating

`variant="floating"` detaches the sidebar from the edge as a rounded, bordered card with a shadow.

<ComponentPreview name="base/SidebarFloatingExample" />

### Icon

`collapsible="icon"` shrinks the sidebar to a `3rem` strip of icons, and each `SidebarMenuButton` with a `tooltip` names its icon on hover.

<ComponentPreview name="base/SidebarIconExample" />

### Inset

`variant="inset"` renders the page content in a rounded panel inside the sidebar's background.

<ComponentPreview name="base/SidebarInsetExample" />

## API reference

`Sidebar` has no Base primitive of its own. On mobile it is a `Sheet`, styled on the Sveltery Base `Dialog` primitive, and `SidebarMenuButton` shows its `tooltip` with a `Tooltip`, styled on the Sveltery Base `Tooltip` primitive. Both own their behavior, focus handling and accessibility. See the [Base UI Dialog](https://base-ui.com/react/components/dialog) and [Base UI Tooltip](https://base-ui.com/react/components/tooltip) documentation for the behavior they port.
