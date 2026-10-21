# Styling & Customization

See [customization.md](../customization.md) for theming, CSS variables and custom colors.

## Contents

- Semantic colors
- No raw colors for status
- Built-in variants first
- `class` for layout only
- No `space-x-*` / `space-y-*`
- Prefer `size-*` over `w-*` `h-*` when equal
- Prefer `truncate`
- No manual `dark:` color overrides
- Conditional classes
- No manual `z-index` on overlay components
- Style open triggers with Base UI's attributes
- Use the shimmer and scroll-fade utilities

---

## Semantic colors

**Incorrect:**

```svelte
<div class="bg-blue-500 text-white">
  <p class="text-gray-600">Secondary text</p>
</div>
```

**Correct:**

```svelte
<div class="bg-primary text-primary-foreground">
  <p class="text-muted-foreground">Secondary text</p>
</div>
```

---

## No raw colors for status

For positive, negative or status values, use `Badge` variants, semantic tokens such as `text-destructive`, or a custom token. Not raw Tailwind colors.

**Incorrect:**

```svelte
<span class="text-emerald-600">+20.1%</span>
<span class="text-green-500">Active</span>
<span class="text-red-600">-3.2%</span>
```

**Correct:**

```svelte
<Badge variant="secondary">+20.1%</Badge>
<Badge>Active</Badge>
<span class="text-destructive">-3.2%</span>
```

If a success color is needed and no token exists, ask the user about adding one (see [customization.md](../customization.md#adding-custom-colors)).

---

## Built-in variants first

**Incorrect:**

```svelte
<Button class="border border-input bg-transparent hover:bg-accent">Click me</Button>
```

**Correct:**

```svelte
<Button variant="outline">Click me</Button>
```

---

## `class` for layout only

Use `class` for layout (`max-w-md`, `mx-auto`, `mt-4`), not to override a component's colors or typography. Never write `className`: Svelte ignores it on components and it is not an HTML attribute.

**Incorrect:**

```svelte
<Card className="max-w-md">...</Card>
<Card class="bg-blue-100 font-bold text-blue-900">...</Card>
```

**Correct:**

```svelte
<Card class="mx-auto max-w-md">...</Card>
```

To change a component's look, prefer in order:

1. **Built-in variants.** `variant="outline"`, `variant="destructive"`.
2. **Semantic tokens.** `bg-primary`, `text-muted-foreground`.
3. **CSS variables.** A custom token in the global CSS file.

---

## No space-x-* / space-y-*

Use `gap-*`. `space-y-4` → `flex flex-col gap-4`. `space-x-2` → `flex gap-2`.

```svelte
<div class="flex flex-col gap-4">
  <Input />
  <Input />
  <Button>Submit</Button>
</div>
```

---

## Prefer size-* over w-* h-* when equal

`size-10`, not `w-10 h-10`. Applies to icons, avatars, skeletons and so on.

---

## Prefer truncate

`truncate`, not `overflow-hidden text-ellipsis whitespace-nowrap`.

---

## No manual dark: color overrides

Semantic tokens switch with the `dark` class. `bg-background text-foreground`, not `bg-white dark:bg-gray-950`.

---

## Conditional classes

On an element, use Svelte's `class` array or object. To merge classes passed to a component of your own, or to resolve Tailwind conflicts, use `cn()` from the `cn` package. Don't build class strings with template-literal ternaries.

**Incorrect:**

```svelte
<div class={`flex items-center ${active ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}></div>
```

**Correct:**

```svelte
<div class={['flex items-center', active ? 'bg-primary text-primary-foreground' : 'bg-muted']}></div>
```

```svelte
<script lang="ts">
  import { cn } from 'cn';

  let { class: className, ...props } = $props();
</script>

<div class={cn('flex items-center gap-2', className)} {...props}></div>
```

---

## No manual z-index on overlay components

`Dialog`, `Sheet`, `Drawer`, `AlertDialog`, `DropdownMenu`, `Popover`, `Tooltip` and `HoverCard` portal and stack themselves. Never add `z-50` or `z-[999]`.

---

## Style open triggers with Base UI's attributes

Base UI does not set `data-open` or `data-state` on most triggers, so `data-open:` and `data-[state=open]:` classes on a trigger never match. Use the attribute the trigger sets:

| Trigger | Attribute | Example |
| --- | --- | --- |
| Menu, popover, dialog, tooltip, navigation menu | `data-popup-open` | `data-popup-open:bg-accent` |
| Collapsible and accordion | `data-panel-open` | `data-panel-open:rotate-90` |
| Any trigger with `aria-expanded` | `aria-expanded` | `aria-expanded:bg-muted` |

Popups and panels, such as `DropdownMenuContent` and `CollapsibleContent`, do set `data-open` and `data-closed`.

---

## Use the shimmer and scroll-fade utilities

`@sveltery/ui/tailwind.css` defines `shimmer` for a loading-text sweep and `scroll-fade` (with `scroll-fade-x`, `scroll-fade-y`, `scroll-fade-t`, `scroll-fade-b`) for faded scroll edges. Don't write custom `@keyframes` or mask gradients for them.

**Incorrect:**

```svelte
<span class="animate-pulse bg-linear-to-r from-muted-foreground/40 via-foreground/70 to-muted-foreground/40 bg-clip-text text-transparent">
  Thinking…
</span>
```

**Correct:**

```svelte
<span class="shimmer">Thinking…</span>
```
