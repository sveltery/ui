---
title: Differences from shadcn/ui
description: Where Sveltery UI deliberately differs from shadcn/ui's Base UI variant and from Base UI.
order: 9
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

**Why:** A Base UI submenu trigger gets [`data-popup-open`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/menu/submenu-trigger/MenuSubmenuTriggerDataAttributes.ts), not `data-open`. In upstream's context menu, the parent row loses its highlight when the pointer moves into the submenu. On the [ui.shadcn.com context menu preview](https://ui.shadcn.com/preview/base/context-menu-example), an open sub-trigger with the pointer in its submenu has `data-popup-open` and a transparent background. The highlight is intended: shadcn/ui's Radix variant keeps it, and Base UI's own [submenu demo](<https://github.com/mui/base-ui/blob/v1.9.0/docs/src/app/(docs)/react/components/context-menu/demos/submenu/css-modules/index.module.css#L158>) styles `[data-popup-open]`.

**Decided:** Hugo Hsi, 2026-10-16

### Examples copied from the Radix variant use Base UI's attributes

**Upstream:** The chevron in [`collapsible-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/collapsible-example.tsx#L110) rotates on `group-data-[state=open]`, as does the folder chevron in [`collapsible-file-tree.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/collapsible-file-tree.tsx#L74). The bookmark icons in [`toggle-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/toggle-example.tsx#L321) (also line 331) fill on `group-data-[state=on]/toggle`. These are Radix attributes.

**Sveltery UI:** The [Collapsible](/docs/components/collapsible) kitchen-sink and file tree examples use `group-data-panel-open:`, and the [Toggle](/docs/components/toggle) example uses `group-data-pressed/toggle:`.

**Upstream:** The chevron in [`collapsible-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/collapsible-example.tsx#L110) rotates on `group-data-[state=open]`. The bookmark icons in [`toggle-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/toggle-example.tsx#L321) (also line 331) fill on `group-data-[state=on]/toggle`. These are Radix attributes. The menu buttons and the collapsible chevron in [`sidebar-demo.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/sidebar-demo.tsx#L223) use `data-[state=open]`, and its dropdown menus are `w-(--radix-dropdown-menu-trigger-width)`, a Radix variable.

**Sveltery UI:** The [Collapsible](/docs/components/collapsible) example uses `group-data-panel-open:`, and the Toggle preview example (`ToggleExample.svelte`) uses `group-data-pressed/toggle:`. The [Sidebar](/docs/components/sidebar) demo uses `data-popup-open:`, `group-data-open/collapsible:` and `w-(--anchor-width)`.

**Why:** Base UI never sets `data-state`, so upstream's chevron does not rotate and the bookmark does not fill when pressed. It has no `--radix-dropdown-menu-trigger-width`, so that class sets no width.

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

### A disabled Radio Group item or Checkbox is dimmed

**Upstream:** The radio item in [`radio-group.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/radio-group.tsx#L22) and the checkbox in [`checkbox.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/checkbox.tsx#L13) dim with `disabled:cursor-not-allowed disabled:opacity-50`. Base UI renders both as a `span` next to a hidden input ([`RadioRoot.tsx`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/radio/root/RadioRoot.tsx#L129), [`CheckboxRoot.tsx`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/checkbox/root/CheckboxRoot.tsx)), and a `span` never matches `:disabled`.

**Sveltery UI:** [Radio Group](/docs/components/radio-group) items and the [Checkbox](/docs/components/checkbox) use `data-disabled:cursor-not-allowed data-disabled:opacity-50`, as upstream's switch already does.

**Why:** In upstream, a disabled radio item looks the same as an enabled one, and a disabled checkbox dims only inside a `Field`, through the style's `group-has-disabled/field:opacity-50`. Base UI sets `data-disabled` on both when they are disabled.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### A disabled Accordion item is dimmed

**Upstream:** The trigger in [`accordion.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/accordion.tsx#L36) dims with `aria-disabled:pointer-events-none aria-disabled:opacity-50`. Base UI 1.9.0 renders a disabled trigger as a native button with `disabled` and no `aria-disabled` ([`AccordionTrigger.tsx`](https://github.com/mui/base-ui/blob/v1.9.0/packages/react/src/accordion/trigger/AccordionTrigger.tsx#L44)).

**Sveltery UI:** The [Accordion](/docs/components/accordion) trigger also uses `disabled:pointer-events-none disabled:opacity-50`.

**Why:** With Base UI 1.9.0, a disabled Accordion item in upstream looks the same as an enabled one. The shadcn/ui site dims it only because it runs an older Base UI that sets `aria-disabled`.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Switch thumb is centered at every position

**Upstream:** Five styles give the default switch a fractional track height: `h-[18.4px]` in Lyra, Maia, Nova and Vega, for example [`style-nova.css`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/styles/style-nova.css#L1251), and `h-[16.6px]` in [`style-mira.css`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/styles/style-mira.css#L1253). The thumb then sits 1.2px or 1.3px inside the track.

**Sveltery UI:** The [Switch](/docs/components/switch) track is `h-[18px]` in those four styles and `h-[16px]` in Mira, so the thumb sits 1px inside it.

**Why:** The browser rounds the track and the thumb to whole device pixels, and a fractional inset rounds differently at the top and the bottom. Depending on where the switch lands on the page, the track shows one more pixel above or below the thumb.

**Decided:** Hugo Hsi, 2026-10-17

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

### A panel's `resize()` takes every size unit

**Upstream:** shadcn d2fba50 locks react-resizable-panels 4.5.8. Its panel [`resize()`](https://github.com/bvaughn/react-resizable-panels/blob/4.5.8/lib/global/utils/getImperativePanelMethods.ts#L164-L183) reads a string with `parseFloat`, so `resize("300px")` sets the panel to 300 percent, which the layout then clamps, and `resize("10rem")` to 10 percent. Its own documentation says the method takes pixels, `rem`, `em`, `vh` and `vw`.

**Sveltery UI:** `resize()` on a [Resizable](/docs/components/resizable) panel converts every unit from the measured group, with the change react-resizable-panels made in [4.7.3](https://github.com/bvaughn/react-resizable-panels/commit/e8dd4300a1db74b127d91e77fc81b16ed0bd4af8). The package otherwise runs 4.5.8's code unchanged.

**Why:** A size with a unit resizes the panel to that size, as upstream documents and later fixed.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Arrow keys move focus in the Calendar

**Upstream:** `CalendarDayButton` in [`calendar.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/calendar.tsx#L216-L218) creates a ref and focuses it when the day is focused, but never passes the ref to its `Button`. The Radix variant's [`calendar.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/radix/ui/calendar.tsx#L223) passes `ref={ref}`.

**Sveltery UI:** In the [Calendar](/docs/components/calendar), the arrow keys move keyboard focus to the next day.

**Why:** In upstream, the arrow keys move the focus ring (`data-focused`) but keyboard focus stays where it was. Enter then selects the day that kept focus, not the one with the ring, and screen readers announce no move. The Radix variant shows the intent.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Calendar and Input OTP keep the style classes the registry build drops

**Upstream:** The registry build inlines each style's `cn-*` classes only in `cva` calls, `className` attributes, `className:` object keys, and `mergeProps` calls ([`transform-style-map.ts`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/packages/shadcn/src/styles/transform-style-map.ts#L41-L58)). It misses three classes that the style files define, for example in [`style-nova.css`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/styles/style-nova.css):

- `cn-calendar-dropdown-root` and `cn-calendar-caption-label` are `classNames` keys in [`calendar.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/calendar.tsx#L76-L88). The style gives the dropdown root a border and focus ring ([`style-nova.css`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/styles/style-nova.css#L235-L237)), and the caption label `h-6 pr-1 pl-1.5` ([`style-nova.css`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/styles/style-nova.css#L239-L241)).
- `cn-input-otp` is the `containerClassName` in [`input-otp.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/input-otp.tsx#L19-L22). The style gives it `gap-2` ([`style-nova.css`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/styles/style-nova.css#L682-L684)).

The served [`base-nova/calendar.json`](https://ui.shadcn.com/r/styles/base-nova/calendar.json) and [`base-nova/input-otp.json`](https://ui.shadcn.com/r/styles/base-nova/input-otp.json) keep these classes as raw tokens, and the site has no rule for them. On ui.shadcn.com, the month and year dropdowns have no border and no focus ring, the dropdown caption has no height or padding, and the Input OTP root has no gap between its groups and separators.

**Sveltery UI:** The [Calendar](/docs/components/calendar) dropdowns and caption get the style's classes, and so does the [Input OTP](/docs/components/input-otp) root.

**Why:** The style files define these classes for these elements, so their absence upstream is a build gap, not a design choice. Without them, a focused dropdown shows no focus ring.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

## Command menu

shadcn/ui's [Command](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/command.tsx) is built on [cmdk](https://github.com/pacocoursey/cmdk) 1.1.1, and Sveltery UI's [Command](/docs/components/command) on its port, `@sveltery/command`. The links below point at cmdk commit [`dd2250e`](https://github.com/pacocoursey/cmdk/tree/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3), which is 1.1.1 with README changes. The port renders the same elements and attributes as cmdk, except where an entry here says otherwise.

### `aria-activedescendant` always names the selected item

**Upstream:** cmdk sets `selectedItemId` by reading the selected item from the DOM in a scheduled callback ([index.tsx:251](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L251)). When the menu opens or the search changes, that callback runs in the same pass that picks the new item ([index.tsx:1050](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L1050)), before React renders the selection, so it finds the previous item or none. The input and list take `aria-activedescendant` from it ([index.tsx:814](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L814), [index.tsx:866](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L866)). On [ui.shadcn.com's command preview](https://ui.shadcn.com/preview/base/command-example), the attribute is missing when the menu opens and names the item selected before the last search.

**Sveltery UI:** The input and list always point `aria-activedescendant` at the selected item.

**Why:** Screen readers announce the active option from `aria-activedescendant`, so upstream announces nothing on open and the wrong item after a search.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Results stay ranked when the search changes in one step

**Upstream:** cmdk sorts the items as soon as the search changes ([index.tsx:238](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L238)), before React renders the items the new search brings back. Those items stay registered while hidden ([index.tsx:672](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L672), [index.tsx:702](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L702)), so nothing sorts again once they render, and React appends them after the items already shown. On the preview, searching "ca" and then pasting "e" lists Calendar above Search Emoji, though Search Emoji scores higher. Typing "e" into an empty search lists Search Emoji first.

**Sveltery UI:** Results are in score order whatever the previous search was.

**Why:** Pasting, replacing the selected text, or setting the search from code would otherwise show a worse match first and select it.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Clearing the search restores the declared order

**Upstream:** With no search, cmdk's sort returns before moving anything ([index.tsx:369](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L369)), so items that stayed mounted keep the last ranked order. On the preview, searching "e" and clearing it lists Search Emoji above Calendar, and a different search leaves a different order.

**Sveltery UI:** With no search, items are in the order they are written.

**Why:** Upstream's order after clearing depends on the previous search, so the same menu opens in different orders.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Opening the menu does not scroll the page

**Upstream:** cmdk scrolls the selected item into view on every selection change except the pointer's ([index.tsx:256](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L256)). It also scrolls once when the menu mounts ([index.tsx:221](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L221)).

**Sveltery UI:** Only keyboard moves and a new search scroll the selection into view.

**Why:** An inline menu below the fold scrolls the page to itself when it mounts.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### `onValueChange` fires without a bound value

**Upstream:** cmdk calls `onValueChange` only when `value` is controlled ([index.tsx:261](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L261)).

**Sveltery UI:** `onValueChange` fires for every change of the selected value, whether or not `value` is bound.

**Why:** Upstream's callback never runs for an uncontrolled menu, which reads as broken to whoever passes it.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### A group of force-mounted items stays visible

**Upstream:** A force-mounted item does not register with cmdk ([index.tsx:672](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L672)), so its group counts no matches and hides while searching ([index.tsx:736](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L736)), taking the item with it.

**Sveltery UI:** A group that holds only force-mounted items stays visible while searching. The docs search menu relies on this for its search results group.

**Why:** `forceMount` exists to keep the item on screen.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Empty does not flash on the server

**Upstream:** cmdk's count of matches starts at 0 ([index.tsx:179](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L179)) and Empty renders while it is 0 ([index.tsx:900](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L900)), so server-rendered markup shows "No results" above the full list until the client mounts.

**Sveltery UI:** Empty renders only after the menu mounts.

**Why:** The empty message would flash on every server-rendered page with a command menu.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Parts render in their List or Group

**Upstream:** cmdk sorts by moving item nodes in the DOM, and an element wrapped around a grouped item moves with it ([index.tsx:410](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L410)). Other markup in the list or a group stays where it is written until a search moves the items after it.

**Sveltery UI:** Svelte cannot move the nodes it renders, so List and each Group render their items, groups, separators and empty and loading states themselves, in cmdk's order, with a comment where each part is written. An element wrapped around a part stays empty, other markup written in List or Group renders before its parts, and context set between List or Group and an item does not reach the item's content.

**Why:** Rendering the parts from their container is how Svelte can show cmdk's DOM order while it owns every node.

**Decided:** Hugo Hsi, 2026-10-17

### Only the menu in use moves focus

**Upstream:** When the selection changes and any command menu's input or root has focus, cmdk moves focus to its own input ([index.tsx:245](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L245)). With two menus on a page, items loading into one take focus from the other's input.

**Sveltery UI:** Focus moves to the input only when that menu's own input or root has focus.

**Why:** Typing in one menu should not be interrupted by another.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Groups are ordered by their best match

**Upstream:** cmdk means to move groups by their best item's score, but looks each group up by `data-value` equal to its encoded internal id ([index.tsx:422](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L422)). A group's `data-value` is its heading, so the lookup never matches and groups keep their template order.

**Sveltery UI:** While searching, a group whose best item scores higher comes first. Ties keep the template order.

**Why:** cmdk's own comment says groups sort by their highest item score ([index.tsx:367](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L367)), and with upstream's order the best match can sit below weaker ones.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Only one item is selected when values repeat

**Upstream:** cmdk marks an item selected when its value equals the selected value ([index.tsx:681](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L681)), so every item sharing that value is highlighted together.

**Sveltery UI:** Only the item reached with the keyboard or pointer is selected, and the arrow keys walk each duplicate in turn.

**Why:** With upstream, two rows light up and `aria-activedescendant` can name only one of them.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Item click and pointer handlers run

**Upstream:** cmdk's item passes its props to the element and then sets its own `onPointerMove` and `onClick` ([index.tsx:709](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L709), [index.tsx:718](https://github.com/pacocoursey/cmdk/blob/dd2250ed608443e8f32bafc5fa2d1d07a3746aa3/cmdk/src/index.tsx#L718)), so handlers given to an item never run.

**Sveltery UI:** An item runs its `onclick` and `onpointermove` and then selects or activates as cmdk does.

**Why:** A handler that silently never runs looks like a bug to whoever passes it.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

## Example content

### The Collapsible settings inputs have distinct ids

**Upstream:** All four inputs in [`collapsible-settings.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/collapsible-settings.tsx#L36-L63) have `id="radius"`, and their labels point at `radius-x` and `radius-y`.

**Sveltery UI:** The [Collapsible](/docs/components/collapsible) settings example gives each input its own id, matching its label.

**Why:** Duplicate ids are invalid HTML, and a label whose `for` matches no id does not name its input.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Dialog demo and RTL forms submit

**Upstream:** In [`dialog-demo.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/dialog-demo.tsx) and [`dialog-rtl.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/dialog-rtl.tsx), the `form` wraps the trigger and the dialog content. The content renders in a portal outside the form, so **Save changes** does not submit it.

**Sveltery UI:** The [Dialog](/docs/components/dialog) demo and RTL examples put the `form` inside the dialog content and close the dialog on submit.

**Why:** A submit button must submit its form. This is the same fix as "The Dialog form example submits" above.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Toggle Group select starts on one of its items

**Upstream:** The "With Input and Select" example in [`toggle-group-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/toggle-group-example.tsx#L343) sets `defaultValue={items[0]}`, an object, while each `SelectItem` has a string `value`.

**Sveltery UI:** The [Toggle Group](/docs/components/toggle-group) example gives each item the object as its value, so the default matches an item.

**Why:** In upstream, no item matches the value. Base UI finds no selected item and skips the item-aligned position, so the popup opens from the edge of the trigger instead of over the selected item.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### The Toggle Group usage snippet has no `type`

**Upstream:** The [Toggle Group](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/toggle-group.mdx) usage snippet passes `type="single"`, a Radix prop that Base UI's toggle group does not take.

**Sveltery UI:** The [Toggle Group](/docs/components/toggle-group) usage snippet passes no `type`. A group is single-select until you add `multiple`.

**Why:** Base UI ignores `type`, so the prop in upstream's snippet does nothing.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Every icon in the Button example has `data-icon`

**Upstream:** In [`button-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/button-example.tsx#L186), the small outline button's trailing icon has no `data-icon`. Its sibling buttons all have `data-icon="inline-end"`.

**Sveltery UI:** The [Button](/docs/components/button) example gives that icon `data-icon="inline-end"` too.

**Why:** `data-icon` sets the button's padding next to the icon, so upstream's outline button is spaced differently from its siblings.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### The Dialog form example submits

**Upstream:** In the "With Form" example of [`dialog-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/dialog-example.tsx#L83-L116), the `form` wraps the trigger and the dialog content. The content renders in a portal outside the form, so **Save changes** does not submit it.

**Sveltery UI:** The Dialog kitchen-sink example (`DialogExample.svelte`, no longer shown on the page) puts the `form` inside the dialog content.

**Why:** A submit button must submit its form.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### Navigation Menu example links go to Sveltery UI pages

**Upstream:** The links in [`navigation-menu-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/navigation-menu-example.tsx#L24-L53) point at shadcn/ui's `/docs/primitives/*` routes, and the Typography link at [line 82](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/navigation-menu-example.tsx#L82) points at `/docs/primitives/typography`.

**Sveltery UI:** The [Navigation Menu](/docs/components/navigation-menu) example links to the matching `/docs/components/*` pages, Typography included. The `/docs` and `/docs/installation` links keep upstream's values.

**Why:** Upstream's `/docs/primitives/*` paths do not exist on this site, so the links would return 404.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### The Sidebar page shows its RTL example inline

**Upstream:** The [Sidebar page](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/sidebar.mdx?plain=1#L550) links to the full-page `/view/base-nova/sidebar-rtl` instead of previewing it. Its Width section says to set `--sidebar-width-mobile` in the `style` prop, but [`sidebar.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/sidebar.tsx#L193) sets the mobile width from the `SIDEBAR_WIDTH_MOBILE` constant and never reads that variable.

**Sveltery UI:** The [Sidebar](/docs/components/sidebar) page previews `SidebarRtlExample` in a frame under RTL, like the other RTL sections. The Width section names `--sidebar-width` and `--sidebar-width-icon` only, and says the mobile sheet uses `SIDEBAR_WIDTH_MOBILE`.

**Why:** Sveltery UI has no `/view` page for examples, only for blocks. The variable does nothing in either port, so documenting it would mislead.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Sidebar changelog flips the trigger icon with `cn-rtl-flip`

**Upstream:** The [Sidebar page changelog](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/sidebar.mdx?plain=1#L634) says to add `rtl:rotate-180` to the `SidebarTrigger` icon, but [`sidebar.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/sidebar.tsx#L280) uses `cn-rtl-flip`.

**Sveltery UI:** The [Sidebar](/docs/components/sidebar#changelog) changelog says to add `class="cn-rtl-flip"`, which is what the component does.

**Why:** Following upstream's prose would leave the copied icon different from the registry component.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Select Invalid snippet keeps its `Select`

**Upstream:** The [Select page](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/select.mdx?plain=1#L139) shows the Invalid snippet as a bare `SelectTrigger`.

**Sveltery UI:** The [Select](/docs/components/select#invalid) snippet wraps the trigger in `<Select {items}>`.

**Why:** A `SelectTrigger` outside a `Select` throws because it has no Select context, so the bare snippet fails when pasted.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Sidebar examples fit the preview frame

**Upstream:** The sidebar examples size the provider with `min-h-svh` and the sidebar with `fixed h-svh`, for example in [`sidebar-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/sidebar-example.tsx).

**Sveltery UI:** The [Sidebar](/docs/components/sidebar) examples in the docs sit in a preview frame, `<div class="relative h-[32rem] w-full transform-gpu overflow-hidden rounded-lg border">`. Inside it, they use `h-full min-h-0` on the provider, `absolute h-full` on the sidebar, and `min-w-0 overflow-auto` on `SidebarInset`.

**Why:** The docs show each example in a preview frame. A sidebar sized to the viewport would overflow it. At phone widths, the inset content is taller than the frame, and `overflow-auto` lets you scroll it. Without it, the frame cuts the content off.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### The Chart page holds the charts library

**Upstream:** [`chart.mdx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/chart.mdx#L25) links to a separate [charts library](https://github.com/shadcn-ui/ui/tree/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/app/%28app%29/charts) at `/charts`, with one page per chart type.

**Sveltery UI:** The [Chart](/docs/components/chart#charts-library) page has a Charts Library section after its guide. It shows the area, bar, line, pie, radar, radial and tooltip charts, each converted from upstream's `registry/new-york-v4/charts` file, and ends with the Examples and API reference sections of the other component pages.

**Why:** These docs have no `/charts` route, so the link would return 404. The charts stay one click from the guide.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Card changelog edits the style stylesheet

**Upstream:** The "Spacing Variable" changelog in [`card.mdx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/card.mdx) shows diffs to the class strings in `card.tsx`.

**Sveltery UI:** The [Card](/docs/components/card) changelog shows the same changes to the `.cn-card`, `.cn-card-header`, `.cn-card-content` and `.cn-card-footer` rules in the style stylesheet, because the Svelte components carry only the `cn-*` class names.

**Why:** The classes upstream's diff edits do not exist in the Svelte component files.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Calendar page has no Persian / Hijri / Jalali example

**Upstream:** The [Calendar page](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/calendar.mdx) shows a Persian calendar built on [`react-day-picker/persian`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/calendar-hijri.tsx#L12).

**Sveltery UI:** The [Calendar](/docs/components/calendar) page keeps the section and says the Persian calendar is not available. It has no preview.

**Why:** `@sveltery/day-picker` ports only the Gregorian calendar, so there is nothing to swap in. A Gregorian calendar with a Persian locale would look like the Persian calendar but show different dates.

**Decided:** Pending Hugo Hsi's sign-off, 2026-10-17

### The Button page has no `init --pointer` sentence

**Upstream:** The [Button page](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/button.mdx#L69) says the pointer cursor can be enabled with `npx shadcn@latest init --pointer`.

**Sveltery UI:** The [Button](/docs/components/button) page shows only the CSS to add.

**Why:** The `@sveltery/ui` CLI has no `--pointer` option, so the sentence would describe a command that fails.

**Decided:** Pending Hugo Hsi's sign-off, 2026-10-17

### The Bubble variants example writes its ghost text as HTML

**Upstream:** The ghost bubble in [`bubble-variants.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/bubble-variants.tsx#L42) renders its text through a `Markdown` component.

**Sveltery UI:** The [Bubble](/docs/components/bubble) Variants example writes the same text with `<p>`, `<strong>` and `<code>`.

**Why:** Sveltery UI has no Markdown component. The preview looks the same.

**Decided:** Pending Hugo Hsi's sign-off, 2026-10-17

### The Breadcrumb separator example links to /docs/components

**Upstream:** The Components link in [`breadcrumb-separator.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/breadcrumb-separator.tsx#L24) points to `/components`.

**Sveltery UI:** The [Breadcrumb](/docs/components/breadcrumb) Custom separator example points it to `/docs/components`, as the Collapsed example already does.

**Why:** The docs site prerenders every link, and `/components` is not a page here, so the build fails on it.

**Decided:** Pending Hugo Hsi's sign-off, 2026-10-17

### The Item avatar section does not name an `avatar` variant

**Upstream:** The [Item page](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/item.mdx) says "You can use `ItemMedia` with `variant="avatar"` to display an avatar." `ItemMedia` has only the `default`, `icon` and `image` variants, and the example uses the default.

**Sveltery UI:** The [Item](/docs/components/item) page says "You can use `ItemMedia` to display an avatar."

**Why:** `variant="avatar"` does nothing, so copying it from the page would mislead.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Item group example labels its icon buttons

**Upstream:** [`item-group.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/item-group.tsx) renders an icon-only button with no accessible name.

**Sveltery UI:** The [Item](/docs/components/item) group example adds `aria-label="Add {username}"` to each button.

**Why:** A screen reader announces an unnamed button as just "button".

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Toggle Group page has no changelog

**Upstream:** The [Toggle Group page](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/toggle-group.mdx?plain=1#L131) ends with a changelog for the default `spacing` moving from `0` to `2`.

**Sveltery UI:** The [Toggle Group](/docs/components/toggle-group) page ends at its API Reference. Its `spacing` already defaults to `2`.

**Why:** Sveltery's Toggle Group shipped with a default of `2`, so there is no change to migrate from.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Pagination page has a SvelteKit section instead of Next.js

**Upstream:** The [Pagination page](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/pagination.mdx?plain=1#L116) has a Next.js section that edits `pagination.tsx` to render Next.js's `<Link />`.

**Sveltery UI:** The [Pagination](/docs/components/pagination#sveltekit) page has a SvelteKit section saying `PaginationLink` already renders an `<a>` that SvelteKit's router handles.

**Why:** The Next.js steps don't apply to Svelte, and SvelteKit needs no change to the component.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Marker page does not link the Shimmer utility or AI Elements

**Upstream:** The [Marker page](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/marker.mdx?plain=1#L82) links the `shimmer` utility page (also line 113) and the AI Elements Checkpoint page (line 123).

**Sveltery UI:** The [Marker](/docs/components/marker) page keeps the same prose and examples without those links.

**Why:** These docs have no utility pages and no AI Elements, so the links would 404.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Resizable page has no changelog

**Upstream:** The [Resizable page](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/resizable.mdx?plain=1#L114) ends with a changelog for the move to `react-resizable-panels` v4.

**Sveltery UI:** The [Resizable](/docs/components/resizable) page ends at its API Reference.

**Why:** `@sveltery/resizable` never had the v3 API, so the migration steps describe nothing a Sveltery user has.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Input OTP form example narrows its slots on small screens

**Upstream:** [`input-otp-form.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/input-otp-form.tsx) gives each slot `w-11` and the separator `mx-2` at every width.

**Sveltery UI:** The [Input OTP](/docs/components/input-otp) form example adds `max-sm:*:data-[slot=input-otp-slot]:w-9` to each group and `max-sm:mx-0` to the separator.

**Why:** On a phone the card's content area is about 260px, and six `w-11` slots plus the separator need about 312px, so the last slots were clipped.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

## Forms

### The Forms guides cover SvelteKit forms instead of React form libraries

**Upstream:** The [Forms](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/forms/index.mdx) section has a guide for each of [React Hook Form](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/forms/react-hook-form.mdx), [TanStack Form](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/forms/tanstack-form.mdx) and [Formisch](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/forms/formisch.mdx), and lists `useActionState` as coming soon. Each guide keeps the form state in the library and passes it to the `Field` parts.

**Sveltery UI:** The [Forms](/docs/forms) section covers a native `<form>`, [SvelteKit remote forms](/docs/forms/remote-forms) and [SvelteKit form actions](/docs/forms/form-actions). Each page uses the same [Field](/docs/components/field) parts.

**Why:** Upstream's guides are written for React. SvelteKit keeps form state in remote forms and form actions, so Sveltery UI's guides show those. `Field` is a plain `div` that holds no form state, like upstream's [`field.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/field.tsx#L64-L72), so the same parts work with each of them.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-16

### Native Radio Group is a Sveltery UI component

**Upstream:** shadcn/ui has a [Native Select](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/native-select.tsx) but no native radio. Its only radio is the [Radio Group](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/radio-group.tsx) on Base UI.

**Sveltery UI:** [Native Radio Group](/docs/components/native-radio-group) adds `NativeRadioGroup` and `NativeRadio`, a styled `<input type="radio">`. Each style's `cn-native-radio-group` and `cn-native-radio` rules are derived from its `cn-radio-group`, `cn-radio-group-item` and `cn-radio-group-indicator-icon` rules in `apps/docs/registry/sync-styles.ts`. `data-checked` becomes `:checked`, and the indicator becomes a radial-gradient dot of the same color and size.

**Why:** Base UI's radio is a `<span>` with a hidden input. Without JavaScript, only a click on its label picks it, and the keyboard does nothing. A SvelteKit remote form's `as('radio', value)` describes a native input, so it spreads onto `NativeRadio` with no changes, and the form works before the page hydrates.

**Decided:** Hugo Hsi, 2026-10-17

### Native Checkbox, Native Switch and Native Slider are Sveltery UI components

**Upstream:** shadcn/ui has a [Native Select](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/native-select.tsx) but no native checkbox, switch or slider. Its [Checkbox](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/checkbox.tsx), [Switch](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/switch.tsx) and [Slider](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/slider.tsx) run on Base UI.

**Sveltery UI:** [Native Checkbox](/docs/components/native-checkbox), [Native Switch](/docs/components/native-switch) and [Native Slider](/docs/components/native-slider) are styled `<input type="checkbox">`, `<input type="checkbox" role="switch">` and `<input type="range">`. Each style's `cn-native-checkbox`, `cn-native-switch`, `cn-native-switch-thumb` and `cn-native-slider` rules are derived from its Checkbox, Switch and Slider rules in `apps/docs/registry/sync-styles.ts`: `data-checked` becomes `:checked`, the switch thumb follows the input through `peer-checked`, and the slider's track and thumb rules move onto the range pseudo-elements. Each wrapper carries its Base twin's `data-slot`, so Label and Field rules that key on it apply to both. In browsers other than Firefox, the slider's track is not filled left of the thumb.

**Why:** Base UI's controls are a `<span>` with a hidden input, so without JavaScript the keyboard does nothing, and a SvelteKit remote form's `as('checkbox')` or `as('range')` spread describes a native input they don't render. The native twins take the spread with no changes and work before the page hydrates. Only Firefox styles the filled part of a range track (`::-moz-range-progress`); elsewhere it would take JavaScript, which these components avoid.

**Decided:** Hugo Hsi, 2026-10-17

### Native Select styles `multiple`

**Upstream:** [Native Select](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/native-select.tsx) has one height and always draws its chevron, so a `multiple` select is clipped to one row with a chevron over its list.

**Sveltery UI:** With `multiple`, the select takes its list box height, the chevron hides, and the options take the theme's colors, with `bg-muted` for a picked option.

**Why:** A remote form's `as('select multiple')` spreads onto Native Select, and the select must show its options for that to work.

**Decided:** Hugo Hsi, 2026-10-17

## Toast

### Toasts use Toast, not Sonner

**Upstream:** The Base UI variant ships a Sonner component in [`sonner.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/sonner.tsx), and its examples and blocks call `toast()` from `sonner`, for example in [`combobox-example.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/examples/combobox-example.tsx). The site's [`layout.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/app/layout.tsx#L115) shows those toasts with the Radix variant's Sonner `Toaster` at the top center.

**Sveltery UI:** There is no Sonner component. The examples and blocks import `toast` from [Toast](/docs/components/toast), which is built on Base UI's toast, and call `toast.add({ title, description })` or `toast.promise()`. This includes the [Marker](/docs/components/marker) and [Bubble](/docs/components/bubble) examples. Toasts show at the bottom of the window, on the right on wider screens.

**Why:** ui.shadcn.com does not list Sonner among the Base UI components, so the Sonner files in the Base UI variant are left over from the Radix variant. Toast already has Sonner's behavior (stacking, swipe to dismiss, typed toasts, promise toasts), so a second toast system would be redundant.

**Decided:** Hugo Hsi, 2026-10-14 (no Sonner) and 2026-10-16 (examples)

## Code Block

### Code Block takes plain text in `code` and highlighted lines as HTML

**Upstream:** [`CodeBlockContent`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/code-block.tsx#L147) takes a string child or `CodeBlockLine` children, and [`CodeBlockLine`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/ui/code-block.tsx#L208) checks whether its children are empty. [`useHighlightedCode(code, language)`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/hooks/use-highlighted-code.ts) returns one React node per line.

**Sveltery UI:** [Code Block](/docs/components/code-block) takes plain text in a `code` prop on `CodeBlockContent`, and `CodeBlockLine` children otherwise. `useHighlightedCode(() => code, () => language)` returns an object whose `lines` holds one escaped HTML string per line, rendered with `{@html}`. `CodeBlockLine` watches its rendered content to add the newline that keeps an empty line in a copied selection.

**Why:** A Svelte snippet cannot be read as a string or checked for emptiness, and a line of highlighted tokens is markup, not a value a Svelte component can hold. Copying a selection keeps blank lines as upstream's does.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### `add code-block` puts the highlighter in the code-block folder

**Upstream:** `add code-block` also installs the [`use-highlighted-code`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/registry/bases/base/hooks/_registry.ts#L15) item, which writes `hooks/use-highlighted-code.ts` and `lib/highlighter.tsx`, with Shiki 3.

**Sveltery UI:** `add code-block` writes `use-highlighted-code.svelte.ts` and `highlighter.ts` into `components/ui/code-block`, and `code-block` exports `useHighlightedCode`, `loadHighlighter` and `highlightCode`. It depends on Shiki 4, which the docs already use.

**Why:** The registry here builds one item per component folder and finds its dependencies from its imports, so the highlighter goes where `add code-block` installs it.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Code Block page has no Markdown or Typeset example, and its RTL example uses Rhea

**Upstream:** The [Code Block page](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/code-block.mdx#L355) shows a block inside a `typeset` container and a chat message rendered with Streamdown, whose `components.code` routes fenced code to a `CodeBlock`.

**Sveltery UI:** The [Code Block](/docs/components/code-block) page leaves both out. Its RTL example renders in Rhea like the rest of the page, where upstream's [`code-block-rtl`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/code-block.mdx#L369) preview uses Nova.

**Why:** Streamdown is a React library, so the Markdown example needs a Svelte Markdown renderer first. Typeset is not ported yet. A docs page renders every preview in one style.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

## Trace

### The chat examples use `@ai-sdk/svelte`'s `Chat`

**Upstream:** The [Trace demo](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/trace-demo.tsx#L233), [Reasoning](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/trace-thinking.tsx) and [Tool](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/trace-tool-calls.tsx) examples call `useChat` from `@ai-sdk/react` and `getMessageText` from [`lib/ai.ts`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/lib/ai.ts#L8).

**Sveltery UI:** The [Trace](/docs/components/trace) examples create a `Chat` from `@ai-sdk/svelte` with the same scripted transcript from `createChat` in `@shadcn/helpers/ai-sdk`. They read `chat.messages` and `chat.status` and send with `chat.sendMessage`. The demo replays by setting `chat.messages = []` and sending the question again. The Reasoning and Tool examples reset by setting `chat.messages` back to their opening messages. Each example is one file, so `getMessageText` is a few lines in its own script, and a thinking row's click lives in a `SvelteMap` keyed by message and position instead of in a row component.

**Why:** `useChat` is a React hook. `Chat` is the AI SDK's Svelte binding, and `createChat` has no React dependency, so the transcript, timing and streamed parts are upstream's.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Trace page links to AI Elements on ui.shadcn.com

**Upstream:** The [Trace page](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/trace.mdx#L20) has a Built with Trace table and "See ... for more examples" links to [AI Elements](https://ui.shadcn.com/docs/ai-elements), which holds the Chain of Thought, Reasoning, Sources, Stack Trace, Task and Tool pages. The Stack Trace examples belong to that library.

**Sveltery UI:** The [Trace](/docs/components/trace) page keeps the table and the links, and they open ui.shadcn.com. It notes that AI Elements is React code, and it ports no Stack Trace example.

**Why:** AI Elements is not ported, so no Sveltery UI page can take the links. The table still names the patterns `Trace` builds, and the upstream pages show how each one is put together.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Link rows in the Steps and Whole Turn examples point at their own section

**Upstream:** The [Steps](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/trace-steps.tsx#L40) and [Whole Turn](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/trace-turn.tsx#L86) examples link to `#steps` and `#turn`, which are not headings on the Trace page.

**Sveltery UI:** The [Trace](/docs/components/trace) examples link to `#chain-of-thought` and `#whole-turn`, the headings of their own sections.

**Why:** The docs build fails a page that links to an anchor it does not have. The row still shows a link, and following it stays on the page.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

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

## Data Table guide

### The guide has no state wiring steps

**Upstream:** The [Data Table guide](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/data-table.mdx#L492) opens its Sorting, Filtering, Visibility and Row Selection sections with an "Update `<DataTable>`" step. Each step keeps one state slice in `React.useState` and passes it to `useTable` as `state` and `on*Change`.

**Sveltery UI:** The [Data Table](/docs/components/data-table) guide drops those steps where nothing is left to change. Sorting and Row Selection go straight to the column definitions, and Filtering and Visibility add only the input and the menu. `createTable` from `@tanstack/svelte-table` keeps every state slice itself.

**Why:** Wiring state by hand is how the React adapter gets it. The Svelte adapter reads and writes the slices through the table, so passing `state` and `on*Change` would only repeat what it already does. The guide still works the same for the user: sorting, filtering, hiding columns and selecting rows all happen in the table.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### Column definitions return components and snippets

**Upstream:** The guide's [`columns.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/data-table.mdx#L167-L197) returns JSX from `header` and `cell`, and renders it with `<table.FlexRender />`.

**Sveltery UI:** `columns.ts` cannot hold markup, so a cell returns `renderComponent(Component, props)`. The row menu, the sortable email header, the select checkbox and the right-aligned amount are small components next to `columns.ts`. The amount header is the one snippet, `renderSnippet(createRawSnippet(...))`, because it is static text. The table renders them with `<FlexRender />` from `@tanstack/svelte-table`, and the guide's callout about it describes that component.

**Why:** A `.ts` module has no template. A `createRawSnippet` reads its arguments once, so a cell built with it keeps its first value when `data` changes. A component takes the new `amount` as a prop.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### A menu label sits inside a group

**Upstream:** The guide's row actions put [`DropdownMenuLabel`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/data-table.mdx#L409) directly in `DropdownMenuContent`, and the Tasks [`data-table-view-options.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/app/%28app%29/examples/tasks/components/data-table-view-options.tsx#L36) does the same. Upstream's own [`data-table-demo.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/examples/base/data-table-demo.tsx#L176) wraps its labels in `DropdownMenuGroup`.

**Sveltery UI:** The row actions and the view options wrap `DropdownMenuLabel` in a `DropdownMenuGroup`, as the demo does.

**Why:** Base UI's group label throws "MenuGroupContext is missing" outside a group, so the menu in upstream's guide code never opens.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The reusable components use Base UI's attributes and props

**Upstream:** The Tasks [`data-table-column-header.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/app/%28app%29/examples/tasks/components/data-table-column-header.tsx#L34-L38) and [`data-table-view-options.tsx`](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/app/%28app%29/examples/tasks/components/data-table-view-options.tsx#L25) import the Radix variant's dropdown menu. They use `DropdownMenuTrigger asChild` and `data-[state=open]:bg-accent`, and the column header is generic over `TData` and `TValue`.

**Sveltery UI:** The [Data Table](/docs/components/data-table#reusable-components) components use a `render` snippet on the trigger and `data-popup-open:bg-accent`. The column header types `column` as the four methods it calls, so `renderComponent` accepts the column that a header receives. The guide links the Tasks demo on ui.shadcn.com, because these docs have no `/examples/tasks` page. The shared type is `DataTableFeatures`, where upstream's section calls it `TasksTableFeatures`, and the section adds the line "Put each component next to `data-table-features.ts`". The components use the features the guide registers, so they have no faceting.

**Why:** Base UI never sets `data-state`, so the open column header would not stay highlighted. `renderComponent` cannot infer a component's generics, and a generic `column` prop fails to type-check against `Column<Features, Payment, ...>`. The Tasks features object registers faceting for its faceted filter, which the guide does not build, and the guide's own object is the one the components share.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The RTL example sets its own direction

**Upstream:** The [RTL section](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/data-table.mdx#L891) links the RTL configuration guide, and the preview takes `direction="rtl"` from the docs site's language selector.

**Sveltery UI:** The section links the [RTL guide](/docs/rtl) too. It then names the [DirectionProvider](/docs/components/direction), and the example has its own language buttons and sets `dir` on the table and on each menu.

**Why:** These docs have no language selector that gives a preview its direction, so a Svelte example sets its own.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17

### The Installation step names the other components

**Upstream:** The [Installation](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/apps/v4/content/docs/components/base/data-table.mdx#L48-L50) step adds only `table`, and the guide imports `button`, `checkbox`, `dropdown-menu`, `input` and `select` without saying so.

**Sveltery UI:** The step adds a sentence that lists those five components.

**Why:** A project that follows the guide from a fresh `init` fails to build at the first import of a component it never added.

**Decided:** Under Hugo Hsi's standing rule, 2026-10-17
