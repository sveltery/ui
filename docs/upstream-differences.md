# Upstream differences

Sveltery UI mirrors shadcn/ui. This file lists the deliberate differences that are not React-versus-Svelte translations.

## No Sonner component

shadcn/ui ships both Sonner (`sonner.tsx`, on the `sonner` library) and Toast (on Base UI Toast). Sveltery UI ships only Toast. Toast already has sonner's behavior (stacking, swipe to dismiss, typed toasts, promise toasts), so a second toast system would be redundant. This is Hugo Hsi's decision of 2026-10-14.

Where upstream code imports `toast` from `sonner`, Sveltery UI imports `toast` from `$lib/components/ui/toast` and calls `toast.add({ title, description })` or `toast.promise()`. This covers the docs examples and blocks too.

## Form and FormError

`Field` and its parts are plain elements, as in shadcn/ui, and you wire them by hand. Sveltery UI also ships `Form`, which is Base `Form`, and `FormError`, which is Base `Form.Error`. shadcn/ui has neither. shadcn/ui's form pages build on React Hook Form and TanStack Form. Sveltery UI's form pages use SvelteKit remote forms and form actions with a plain `<form>`.

## Upstream bugs fixed on Base

Where upstream code misbehaves on Base UI, Sveltery UI fixes it instead of copying it. Hugo Hsi decided on 2026-10-14 to keep these fixes and log each one here. Paths are under `apps/v4/registry/bases/base/` in shadcn-ui/ui at 4233ed1.

| Upstream | What is wrong | What Sveltery UI does |
| --- | --- | --- |
| `blocks/sidebar-01/components/version-switcher.tsx:34`, `blocks/sidebar-02/components/version-switcher.tsx:34`, `blocks/sidebar-07/components/team-switcher.tsx:45`, `blocks/sidebar-09/components/nav-user.tsx:43`, `blocks/sidebar-10/components/nav-actions.tsx:213`, `blocks/dashboard-01/components/data-table.tsx:323` | Menu and popover triggers style their open state with `data-open:`, which Base never sets on a trigger, so the open highlight never shows. | Styles `data-popup-open:`, which Base sets on an open trigger. |
| `blocks/sidebar-10/components/nav-workspaces.tsx:48`, `blocks/sidebar-15/components/nav-workspaces.tsx:48` | The collapsible trigger's chevron rotates on `data-open:`, which Base never sets on a trigger, so it never rotates. | Rotates on `data-panel-open:`. |
| `blocks/sidebar-11/components/app-sidebar.tsx:132` | An open folder's chevron rotates on `[data-state=open]`, which Base never sets, so it never rotates. | Matches `[data-open]` on the collapsible root. |
| `blocks/sidebar-01/components/version-switcher.tsx:65`, `blocks/sidebar-02/components/version-switcher.tsx:65` | Menu items use `onSelect`, which Base menu items never call, so picking a version does nothing. | Uses `onclick`. |
| `blocks/sidebar-09/components/nav-user.tsx:70` | `DropdownMenuLabel` sits outside a `DropdownMenuGroup`, which Base requires. | Wraps the label in the group. |
| `ui/toggle-group.tsx:28` | `orientation` is taken out of the props and never passed to Base's toggle group, so a vertical group keeps horizontal keyboard navigation. | Passes `orientation` to Base's toggle group as well as to `data-orientation`. |
| `ui/toggle-group.tsx:10-20,71-78` | The default `ToggleGroupContext` sets `variant` and `size` to `"default"`, and the item reads `context.variant \|\| variant`, so an item outside a group ignores its own `variant` and `size`. | Leaves `variant` and `size` undefined outside a group, so a standalone item keeps its own. |
| `ui/tabs.tsx:9,15` | `orientation` is taken out of the props for `data-orientation` and never passed to Base's tabs, so a vertical tab list moves focus with Left and Right and has no `aria-orientation="vertical"`. | Passes `orientation` to Base's tabs as well. |
| `ui/slider.tsx:12-17,39` | One thumb is rendered per entry of the array `value`, else the array `defaultValue`, else `[min, max]`. A number value, or no value, renders two thumbs at the same index, so the slider has two tab stops and a form posts the name twice. | Renders one thumb per entry of an array value, and one thumb for a number value or no value. |
| `blocks/dashboard-01/components/chart-area-interactive.tsx:191` | The time-range Select has no `items`, so Base shows the raw value ("7d") instead of its label. | Passes `items`. |
| `blocks/dashboard-01/components/data-table.tsx:402` | A reorder replaces the table's data, and the table then resets to page 1, so a row moved on page 2 jumps the view to page 1. | Sets `autoResetPageIndex: false`. |
| `ui/combobox.tsx:85-88` (at d2fba50) | `InputGroupButton render={<ComboboxTrigger />}` passes Base's `Button` props to the combobox trigger, and its `tabIndex={0}` overrides the trigger's own `tabIndex={-1}` (Base UI `combobox/trigger/ComboboxTrigger.tsx:157`). The trigger becomes a second tab stop after the input. shadcn's Radix variant (`bases/radix/ui/combobox.tsx`, `asChild`) keeps `-1`. | Keeps the trigger out of the tab order, as Base UI and shadcn's Radix variant do. |

## Server Component render output

shadcn/ui's `ui/button.tsx` has no `"use client"`, and its docs examples are Server Components. Next.js renders `<Button>` on the server, so a trigger's `render={<Button />}` arrives as the finished `<ButtonPrimitive data-slot="button">`, and Base UI's `mergeProps(props, render.props)` (`internals/useRenderElement.tsx:171`) lets `data-slot="button"` win. In a Client Component, the same code ends with the trigger's slot, because `Button` spreads its props after `data-slot="button"` (`ui/button.tsx:43`). Upstream shows both: the sheet's corner close button, in the client file `ui/sheet.tsx:63-71`, is `data-slot="sheet-close"`, and the footer close in the example `examples/sheet-example.tsx:56` is `data-slot="button"`.

Sveltery UI has no Server Components, so an element rendered through a trigger keeps the trigger's `data-slot` (`dialog-trigger`, `popover-trigger`, `sheet-close` and so on), as Base UI does in client code. Only shadcn/ui's rhea and luma `cn-code-block-actions` rule selects `data-slot=button`, and no code block example puts a trigger there. Paths are in shadcn-ui/ui at d2fba50 and Base UI 1.9.0.

## Svelte adapter differences

- **Data table drag** (`blocks/dashboard-01/components/data-table.tsx:421`). Upstream reorders rows in `onDragEnd`, and React's sortable preset moves the other rows while a row is dragged. `@dnd-kit/svelte` leaves that live sorting out, so Sveltery UI reorders in `onDragOver` and restores the earlier order when a drag is cancelled.
