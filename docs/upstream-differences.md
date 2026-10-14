# Upstream differences

Sveltery UI mirrors shadcn/ui. This file lists the deliberate differences that are not React-versus-Svelte translations.

## No Sonner component

shadcn/ui ships both Sonner (`sonner.tsx`, on the `sonner` library) and Toast (on Base UI Toast). Sveltery UI ships only Toast. Toast already has sonner's behavior (stacking, swipe to dismiss, typed toasts, promise toasts), so a second toast system would be redundant. This is Hugo Hsi's decision of 2026-10-14.

Where upstream code imports `toast` from `sonner`, Sveltery UI imports `toast` from `@sveltery/ui/toast` and calls `toast.add({ title, description })` or `toast.promise()`. This covers the docs examples and blocks too.

## Upstream bugs fixed on Base

Where upstream code misbehaves on Base UI, Sveltery UI fixes it instead of copying it. Hugo Hsi decided on 2026-10-14 to keep these fixes and log each one here. Paths are under `apps/v4/registry/bases/base/` in shadcn-ui/ui at 4233ed1.

| Upstream | What is wrong | What Sveltery UI does |
| --- | --- | --- |
| `blocks/sidebar-01/components/version-switcher.tsx:34`, `blocks/sidebar-02/components/version-switcher.tsx:34`, `blocks/sidebar-07/components/team-switcher.tsx:45`, `blocks/sidebar-09/components/nav-user.tsx:43`, `blocks/sidebar-10/components/nav-actions.tsx:213`, `blocks/dashboard-01/components/data-table.tsx:323` | Menu and popover triggers style their open state with `data-open:`, which Base never sets on a trigger, so the open highlight never shows. | Styles `data-popup-open:`, which Base sets on an open trigger. |
| `blocks/sidebar-10/components/nav-workspaces.tsx:48`, `blocks/sidebar-15/components/nav-workspaces.tsx:48` | The collapsible trigger's chevron rotates on `data-open:`, which Base never sets on a trigger, so it never rotates. | Rotates on `data-panel-open:`. |
| `blocks/sidebar-11/components/app-sidebar.tsx:132` | An open folder's chevron rotates on `[data-state=open]`, which Base never sets, so it never rotates. | Matches `[data-open]` on the collapsible root. |
| `blocks/sidebar-01/components/version-switcher.tsx:65`, `blocks/sidebar-02/components/version-switcher.tsx:65` | Menu items use `onSelect`, which Base menu items never call, so picking a version does nothing. | Uses `onclick`. |
| `blocks/sidebar-09/components/nav-user.tsx:70` | `DropdownMenuLabel` sits outside a `DropdownMenuGroup`, which Base requires. | Wraps the label in the group. |
| `ui/toggle-group.tsx:28` | `orientation` is taken out of the props and never passed to Base's toggle group, so a vertical group keeps horizontal keyboard navigation. | Leaves `orientation` in the props passed to Base. |
| `blocks/dashboard-01/components/chart-area-interactive.tsx:191` | The time-range Select has no `items`, so Base shows the raw value ("7d") instead of its label. | Passes `items`. |
| `blocks/dashboard-01/components/data-table.tsx:402` | A reorder replaces the table's data, and the table then resets to page 1, so a row moved on page 2 jumps the view to page 1. | Sets `autoResetPageIndex: false`. |

## Svelte adapter differences

- **Data table drag** (`blocks/dashboard-01/components/data-table.tsx:421`). Upstream reorders rows in `onDragEnd`, and React's sortable preset moves the other rows while a row is dragged. `@dnd-kit/svelte` leaves that live sorting out, so Sveltery UI reorders in `onDragOver` and restores the earlier order when a drag is cancelled.
