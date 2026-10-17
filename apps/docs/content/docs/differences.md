---
title: Differences from shadcn/ui
description: Where Sveltery UI deliberately differs from shadcn/ui's Base UI variant and from Base UI.
order: 4
---

<!--
This page is the one list of deliberate differences from upstream. To add an entry, copy this section under the
`##` group it belongs to and fill it in. Link upstream files at the pinned commits below, not at main.

### <What differs, in a few words>

**Upstream:** <what shadcn/ui or Base UI does, with a link to the file and line>

**Sveltery UI:** <what ours does, with a link to the component page>

**Why:** <the user-visible effect of upstream's behavior and why ours is different>

**Decided:** <name>, <YYYY-MM-DD>
-->

Sveltery UI ports [shadcn/ui](https://ui.shadcn.com)'s Base UI variant to Svelte, on a port of [Base UI](https://base-ui.com) 1.9.0. Upstream is the reference. Components, styles and examples follow it unless an entry on this page says otherwise, and each entry has the maintainer's sign-off. Translations from React to Svelte, such as `class` for `className` or snippets for render functions, are not listed.

The upstream links point at shadcn/ui commit [`d2fba50`](https://github.com/shadcn-ui/ui/tree/d2fba50ee5b9113008b5bb908563527b7efd2f27) and Base UI [`v1.9.0`](https://github.com/mui/base-ui/tree/v1.9.0).

## Open state on Base UI triggers

Base UI marks an open trigger with its own attributes. A collapsible trigger gets [`data-panel-open`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/utils/collapsibleOpenStateMapping.ts), and a menu, popover or submenu trigger gets [`data-popup-open`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/utils/popupStateMapping.ts). It never sets `data-open` or `data-state` on a trigger, so upstream classes that use them never match.

### Sidebar examples and blocks style open triggers with Base UI's attributes

**Upstream:** Some sidebar examples and blocks style an open trigger with the `data-open:` variant:

- The collapsible chevron in [`sidebar-inset-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/sidebar-inset-example.tsx#L224) and in the `nav-workspaces.tsx` of [sidebar-10](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/sidebar-10/components/nav-workspaces.tsx#L48) and [sidebar-15](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/sidebar-15/components/nav-workspaces.tsx#L48) uses `data-open:rotate-90`.
- The menu buttons in [`sidebar-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/sidebar-example.tsx#L182) and [`sidebar-icon-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/sidebar-icon-example.tsx#L248) (also line 385) use `data-open:bg-sidebar-accent`.
- The menu triggers in the [sidebar-01](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/sidebar-01/components/version-switcher.tsx#L34) and [sidebar-02](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/sidebar-02/components/version-switcher.tsx#L34) version switchers, the [sidebar-07 team switcher](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/sidebar-07/components/team-switcher.tsx#L45), the [sidebar-09 user menu](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/sidebar-09/components/nav-user.tsx#L43), the [sidebar-10 actions menu](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/sidebar-10/components/nav-actions.tsx#L213) and the [dashboard-01 row menu](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/dashboard-01/components/data-table.tsx#L323) use `data-open:bg-*`.
- The folder chevron in [sidebar-11](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/sidebar-11/components/app-sidebar.tsx#L132) rotates on `[data-state=open]` on the collapsible root.
- All eight styles give `.cn-sidebar-menu-button` `data-open:hover:bg-sidebar-accent`, for example [`style-nova.css`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/styles/style-nova.css#L1167).

**Sveltery UI:** The [Sidebar](/docs/components/sidebar) examples and the [blocks](/blocks) use `data-panel-open:` on collapsible triggers and `data-popup-open:` on menu triggers. Sidebar-11 matches `[data-open]`, which Base UI sets on the collapsible root. The styles use `data-popup-open:hover:` on `.cn-sidebar-menu-button`.

**Why:** With upstream's classes, the chevrons do not rotate and the menu buttons lose their highlight while the menu is open. Upstream's own [`sidebar-floating-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/sidebar-floating-example.tsx#L198) already uses `data-popup-open:`. The `.cn-sidebar-menu-button` change has no visible effect, because `hover:` paints the same color.

**Decided:** Hugo Hsi, 2026-10-14 (blocks) and 2026-10-16 (examples and styles)

### Menu sub-triggers stay highlighted while the submenu is open

**Upstream:** All eight styles highlight an open sub-trigger with `data-open:bg-accent`. In [`style-nova.css`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/styles/style-nova.css#L451) that is line 451 for the context menu, line 574 for the dropdown menu and line 847 for the menubar. The dropdown menu's [`dropdown-menu.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/dropdown-menu.tsx#L116) adds `data-popup-open:bg-accent` to its sub-trigger, and the menubar reuses that sub-trigger. The context menu's [`context-menu.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/context-menu.tsx#L118) does not.

**Sveltery UI:** All eight styles use `data-popup-open:bg-accent` on the sub-triggers of the [Context Menu](/docs/components/context-menu), [Dropdown Menu](/docs/components/dropdown-menu) and [Menubar](/docs/components/menubar).

**Why:** A Base UI submenu trigger gets [`data-popup-open`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/menu/submenu-trigger/MenuSubmenuTriggerDataAttributes.ts), not `data-open`. In upstream's context menu, the parent row loses its highlight when the pointer moves into the submenu. On the [ui.shadcn.com context menu preview](https://ui.shadcn.com/preview/base/context-menu-example), an open sub-trigger with the pointer in its submenu has `data-popup-open` and a transparent background. The highlight is intended: shadcn/ui's Radix variant keeps it, and Base UI's own [submenu demo](https://github.com/mui/base-ui/blob/v1.9.0/docs/src/app/(docs)/react/components/context-menu/demos/submenu/css-modules/index.module.css#L158) styles `[data-popup-open]`.

**Decided:** Hugo Hsi, 2026-10-16

### Examples copied from the Radix variant use Base UI's attributes

**Upstream:** The chevron in [`collapsible-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/collapsible-example.tsx#L110) rotates on `group-data-[state=open]`. The bookmark icons in [`toggle-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/toggle-example.tsx#L321) (also line 331) fill on `group-data-[state=on]/toggle`. These are Radix attributes.

**Sveltery UI:** The [Collapsible](/docs/components/collapsible) example uses `group-data-panel-open:`, and the [Toggle](/docs/components/toggle) example uses `group-data-pressed/toggle:`.

**Why:** Base UI never sets `data-state`, so upstream's chevron does not rotate and the bookmark does not fill when pressed.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

## Upstream bugs fixed on Base

Where upstream code misbehaves on Base UI, Sveltery UI fixes it instead of copying it.

### Toggle Group passes its orientation to Base UI

**Upstream:** [`toggle-group.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/toggle-group.tsx#L28) takes `orientation` out of the props and never passes it to Base UI's toggle group.

**Sveltery UI:** [Toggle Group](/docs/components/toggle-group) passes `orientation` to Base UI's toggle group as well as to `data-orientation`.

**Why:** Upstream's vertical group keeps horizontal keyboard navigation.

**Decided:** Hugo Hsi, 2026-10-14

### A Toggle Group item outside a group keeps its own variant and size

**Upstream:** The default `ToggleGroupContext` in [`toggle-group.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/toggle-group.tsx#L11-L21) sets `variant` and `size` to `"default"`, and the item reads [`context.variant || variant`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/toggle-group.tsx#L71-L78).

**Sveltery UI:** [Toggle Group](/docs/components/toggle-group) leaves `variant` and `size` undefined outside a group.

**Why:** In upstream, an item outside a group ignores its own `variant` and `size`.

**Decided:** Hugo Hsi, 2026-10-14

### Tabs pass their orientation to Base UI

**Upstream:** [`tabs.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/tabs.tsx#L9-L15) takes `orientation` out of the props for `data-orientation` and never passes it to Base UI's tabs.

**Sveltery UI:** [Tabs](/docs/components/tabs) passes `orientation` to Base UI's tabs as well.

**Why:** In upstream's [vertical example](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/tabs-example.tsx#L306), the list, triggers and panels report a horizontal orientation. The list has no `aria-orientation="vertical"`, and Left and Right still move focus instead of Up and Down.

**Decided:** Hugo Hsi, 2026-10-14

### Slider renders one thumb for a number value

**Upstream:** [`slider.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/slider.tsx#L12-L16) renders one thumb per entry of the array `value`, else of the array `defaultValue`, else of `[min, max]`.

**Sveltery UI:** [Slider](/docs/components/slider) renders one thumb per entry of an array value, and one thumb for a number value or no value.

**Why:** In upstream, a number value or no value renders two thumbs at the same index. The slider then has two tab stops, and a form posts the name twice.

**Decided:** Hugo Hsi, 2026-10-14

### The Combobox trigger stays out of the tab order

**Upstream:** [`combobox.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/combobox.tsx#L85-L88) renders `InputGroupButton render={<ComboboxTrigger />}`. That passes Base UI's `Button` props to the combobox trigger, and its `tabIndex={0}` overrides the trigger's own [`tabIndex={-1}`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/combobox/trigger/ComboboxTrigger.tsx#L157).

**Sveltery UI:** The [Combobox](/docs/components/combobox) trigger keeps `tabindex="-1"`.

**Why:** In upstream, the trigger is a second tab stop after the input. Base UI and shadcn/ui's Radix variant (`asChild`) keep it out of the tab order.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### Blocks work on Base UI

**Upstream:** These blocks misbehave on Base UI:

- In the [sidebar-01](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/sidebar-01/components/version-switcher.tsx#L65) and [sidebar-02](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/sidebar-02/components/version-switcher.tsx#L65) version switchers, the menu items use `onSelect`, which Base UI menu items never call. Picking a version does nothing.
- In the [sidebar-09 user menu](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/sidebar-09/components/nav-user.tsx#L70), `DropdownMenuLabel` sits outside a `DropdownMenuGroup`, which Base UI requires.
- The dashboard-01 [time-range Select](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/dashboard-01/components/chart-area-interactive.tsx#L191) has no `items`, so Base UI shows the raw value ("7d") instead of its label.
- The dashboard-01 [data table](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/dashboard-01/components/data-table.tsx#L402) resets to page 1 when a reorder replaces its data, so a row moved on page 2 jumps the view to page 1.

**Sveltery UI:** The [blocks](/blocks) use `onclick` on the version items, wrap the user menu label in the group, pass `items` to the time-range Select, and set `autoResetPageIndex: false` on the data table.

**Why:** Each fix makes the block do what its upstream code intends.

**Decided:** Hugo Hsi, 2026-10-14

## Example content

### The Toggle Group select starts on one of its items

**Upstream:** The "With Input and Select" example in [`toggle-group-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/toggle-group-example.tsx#L343) sets `defaultValue={items[0]}`, an object, while each `SelectItem` has a string `value`.

**Sveltery UI:** The [Toggle Group](/docs/components/toggle-group) example gives each item the object as its value, so the default matches an item.

**Why:** In upstream, no item matches the value. Base UI finds no selected item and skips the item-aligned position, so the popup opens from the edge of the trigger instead of over the selected item.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### Every icon in the Button example has `data-icon`

**Upstream:** In [`button-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/button-example.tsx#L186), the small outline button's trailing icon has no `data-icon`. Its sibling buttons all have `data-icon="inline-end"`.

**Sveltery UI:** The [Button](/docs/components/button) example gives that icon `data-icon="inline-end"` too.

**Why:** `data-icon` sets the button's padding next to the icon, so upstream's outline button is spaced differently from its siblings.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### The Dialog form example submits

**Upstream:** In the "With Form" example of [`dialog-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/dialog-example.tsx#L83-L116), the `form` wraps the trigger and the dialog content. The content renders in a portal outside the form, so **Save changes** does not submit it.

**Sveltery UI:** The [Dialog](/docs/components/dialog) example puts the `form` inside the dialog content.

**Why:** A submit button must submit its form.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### Navigation Menu example links go to Sveltery UI pages

**Upstream:** The links in [`navigation-menu-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/navigation-menu-example.tsx#L24-L53) point at shadcn/ui's `/docs/primitives/*` routes, and the Typography link at [line 82](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/navigation-menu-example.tsx#L82) points at `/docs/primitives/typography`.

**Sveltery UI:** The [Navigation Menu](/docs/components/navigation-menu) example links to the matching `/docs/components/*` pages. Typography links to `#`, because these docs have no Typography page. The `/docs` and `/docs/installation` links keep upstream's values.

**Why:** Upstream's `/docs/primitives/*` paths do not exist on this site, so the links would return 404.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### Sidebar examples fit the preview frame

**Upstream:** The sidebar examples size the provider with `min-h-svh` and the sidebar with `fixed h-svh`, for example in [`sidebar-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/sidebar-example.tsx).

**Sveltery UI:** The [Sidebar](/docs/components/sidebar) examples in the docs use `h-full min-h-0` on the provider and `absolute h-full` on the sidebar.

**Why:** The docs show each example in a preview frame. A sidebar sized to the viewport would overflow it.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

## Toast

### Toasts use Toast, not Sonner

**Upstream:** The Base UI variant ships a Sonner component in [`sonner.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/sonner.tsx), and its examples and blocks call `toast()` from `sonner`, for example in [`combobox-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/combobox-example.tsx). The site's [`layout.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/app/layout.tsx#L115) shows those toasts with the Radix variant's Sonner `Toaster` at the top center.

**Sveltery UI:** There is no Sonner component. The examples and blocks import `toast` from [Toast](/docs/components/toast), which is built on Base UI's toast, and call `toast.add({ title, description })` or `toast.promise()`. This includes the [Marker](/docs/components/marker) and [Bubble](/docs/components/bubble) examples. Toasts show at the bottom of the window, on the right on wider screens.

**Why:** ui.shadcn.com does not list Sonner among the Base UI components, so the Sonner files in the Base UI variant are left over from the Radix variant. Toast already has Sonner's behavior (stacking, swipe to dismiss, typed toasts, promise toasts), so a second toast system would be redundant.

**Decided:** Hugo Hsi, 2026-10-14 (no Sonner) and 2026-10-16 (examples)

## Rendering and timing

### A trigger keeps its own `data-slot` through `render`

**Upstream:** [`button.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/button.tsx#L43) has no `"use client"`, and the docs examples are Server Components. Next.js renders `<Button>` on the server, so a trigger's `render={<Button />}` arrives as a finished element with `data-slot="button"`, and Base UI's [`mergeProps`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/internals/useRenderElement.tsx#L171) lets that slot win. In a Client Component, the same code ends with the trigger's slot, because `Button` spreads its props after `data-slot="button"`. Upstream shows both: the corner close button in the client file [`sheet.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/sheet.tsx#L63-L71) is `data-slot="sheet-close"`, and the footer close in [`sheet-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/sheet-example.tsx#L56) is `data-slot="button"`.

**Sveltery UI:** Svelte has no Server Components. An element rendered through a trigger keeps the trigger's `data-slot`, such as `dialog-trigger`, `popover-trigger` or `sheet-close`, as Base UI does in client code.

**Why:** It has no visible effect. Only the rhea and luma styles' `cn-code-block-actions` rule selects `data-slot=button`, and no code block example puts a trigger there.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### Menus fade in from the first frame

**Upstream:** On ui.shadcn.com's preview pages, a menu popup mounts with `cn-menu-translucent`, and the site's menu color script removes that class about a frame later. The first frame paints the menu fully opaque, and then the `enter` fade starts from transparent.

**Sveltery UI:** The [Dropdown Menu](/docs/components/dropdown-menu) and the other menus start the `enter` fade on their first frame, as Base UI 1.9.0 does.

**Why:** The one-frame flash comes from site chrome, not from Base UI or the components. Base UI 1.9.0 and Sveltery UI paint the same frames when they run side by side.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### Data table rows move while you drag

**Upstream:** The dashboard-01 [data table](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/blocks/dashboard-01/components/data-table.tsx#L421) reorders rows in `onDragEnd`, and React's sortable preset moves the other rows while a row is dragged.

**Sveltery UI:** `@dnd-kit/svelte` leaves that live sorting out. The [blocks](/blocks) data table reorders in `onDragOver` and restores the earlier order when a drag is cancelled.

**Why:** The other rows make room during the drag, as they do upstream.

**Decided:** Hugo Hsi, 2026-10-14
