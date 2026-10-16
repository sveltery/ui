---
title: Differences from shadcn/ui
description: Where Sveltery UI deliberately differs from shadcn/ui's Base UI variant and from Base UI.
order: 4
---

<!--
To add an entry, copy this section to the end of the page and fill it in.
Link upstream files at a pinned commit, not at main.

## <What differs, in a few words>

**Upstream:** <what shadcn/ui or Base UI does, with a link to the file and line>

**Sveltery UI:** <what ours does, with a link to the component page>

**Why:** <the user-visible effect of upstream's behavior and why ours is different>

Decided by <name>, <YYYY-MM-DD>.
-->

Sveltery UI ports [shadcn/ui](https://ui.shadcn.com)'s Base UI variant to Svelte, on a port of [Base UI](https://base-ui.com) 1.9.0. Upstream is the reference. Components, styles and examples follow it unless an entry on this page says otherwise, and each entry has the maintainer's sign-off.

The upstream links point at shadcn/ui commit [`d2fba50`](https://github.com/shadcn-ui/ui/tree/d2fba50ee5b9113008b5bb908563527b7efd2f27) and Base UI [`v1.9.0`](https://github.com/mui/base-ui/tree/v1.9.0).

## Sidebar examples style open triggers with Base UI's attributes

**Upstream:** Some Base UI sidebar examples style an open trigger with the `data-open:` variant. The collapsible chevron in [`sidebar-inset-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/sidebar-inset-example.tsx#L224) uses `data-open:rotate-90`. The menu buttons in [`sidebar-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/sidebar-example.tsx#L182) and [`sidebar-icon-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/sidebar-icon-example.tsx#L248) use `data-open:bg-sidebar-accent`.

**Sveltery UI:** The [Sidebar](/docs/components/sidebar) examples use `data-panel-open:` on the collapsible trigger and `data-popup-open:` on the menu trigger.

**Why:** Base UI never sets `data-open` on these triggers. A collapsible trigger gets [`data-panel-open`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/utils/collapsibleOpenStateMapping.ts) and a menu trigger gets [`data-popup-open`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/utils/popupStateMapping.ts). With upstream's classes, the chevron does not rotate and the menu button loses its highlight while the menu is open. Upstream's own [`sidebar-floating-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/sidebar-floating-example.tsx#L198) already uses `data-popup-open:`.

Decided by Hugo Hsi, 2026-10-16.

## Menu sub-triggers stay highlighted while the submenu is open

**Upstream:** All eight styles highlight an open sub-trigger with `data-open:bg-accent`, for example [`style-nova.css`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/styles/style-nova.css#L451). The dropdown menu's [`dropdown-menu.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/dropdown-menu.tsx#L116) adds `data-popup-open:bg-accent` to its sub-trigger, and the menubar reuses that sub-trigger. The context menu's [`context-menu.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/context-menu.tsx#L118) does not.

**Sveltery UI:** All eight styles use `data-popup-open:bg-accent` on the sub-triggers of the [Context Menu](/docs/components/context-menu), [Dropdown Menu](/docs/components/dropdown-menu) and [Menubar](/docs/components/menubar).

**Why:** A Base UI submenu trigger gets [`data-popup-open`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/menu/submenu-trigger/MenuSubmenuTriggerDataAttributes.ts), not `data-open`. In upstream's context menu, the parent row loses its highlight when the pointer moves into the submenu. The highlight is intended: shadcn/ui's Radix variant keeps it, and Base UI's own [submenu demo](https://github.com/mui/base-ui/blob/v1.9.0/docs/src/app/(docs)/react/components/context-menu/demos/submenu/css-modules/index.module.css#L158) styles `[data-popup-open]`.

Decided by Hugo Hsi, 2026-10-16.

## Examples show toasts with Toast, not Sonner

**Upstream:** The Base UI variant ships a Sonner component in [`sonner.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/sonner.tsx), and its examples call `toast()` from `sonner`, for example [`combobox-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/combobox-example.tsx). The site's [`layout.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/app/layout.tsx#L115) shows those toasts with the Radix variant's Sonner `Toaster` at the top center.

**Sveltery UI:** There is no Sonner component. The examples call `toast.add()` from [Toast](/docs/components/toast), which is built on Base UI's toast. It shows toasts at the bottom of the window, on the right on wider screens.

**Why:** ui.shadcn.com does not list Sonner among the Base UI components, so the Sonner files in the Base UI variant are left over from the Radix variant. Toast covers the same behavior with Base UI parts.

Decided by Hugo Hsi, 2026-10-16.
