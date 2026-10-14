# Upstream differences

Sveltery UI mirrors shadcn/ui. This file lists the deliberate differences that are not React-versus-Svelte translations.

## No Sonner component

shadcn/ui ships both Sonner (`sonner.tsx`, on the `sonner` library) and Toast (on Base UI Toast). Sveltery UI ships only Toast. Toast already has sonner's behavior (stacking, swipe to dismiss, typed toasts, promise toasts), so a second toast system would be redundant. This is Hugo Hsi's decision of 2026-10-14.

Where upstream code imports `toast` from `sonner`, Sveltery UI imports `toast` from `@sveltery/ui/toast` and calls `toast.add({ title, description })` or `toast.promise()`. This covers the docs examples and blocks too.

## Upstream bugs fixed on Base

Where upstream code misbehaves on Base UI, Sveltery UI fixes it instead of copying it.

- **Version switcher** (blocks sidebar-01 and sidebar-02). Upstream's menu items use `onSelect`, which Base menu items never call. Sveltery UI uses `onclick`.
- **Nav user** (block sidebar-09). Upstream puts `DropdownMenuLabel` outside a `DropdownMenuGroup`, which Base requires. Sveltery UI wraps it in the group.
- **Time range select** (block dashboard-01, `chart-area-interactive`). Upstream's Select has no `items`, so Base shows the raw value ("7d") instead of its label. Sveltery UI passes `items`.
- **Data table reorder** (block dashboard-01, `data-table`). A reorder replaces the table's data, and TanStack Table then resets to page 1 by default. Sveltery UI sets `autoResetPageIndex: false`, so a row moved on page 2 stays on page 2.
