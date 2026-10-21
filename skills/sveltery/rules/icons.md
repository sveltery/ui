# Icons

**Import icons from the project's `iconLibrary`.** Read `config.iconLibrary` from `npx @sveltery/ui@latest info --json`. Never assume Lucide, and never import a React package.

| `iconLibrary` | Package | Import |
| --- | --- | --- |
| `lucide` | `@lucide/svelte` | `import SearchIcon from '@lucide/svelte/icons/search';` |
| `tabler` | `@tabler/icons-svelte` | `import { IconSearch } from '@tabler/icons-svelte';` |
| `hugeicons` | `@hugeicons/svelte` + `@hugeicons/core-free-icons` | `import { HugeiconsIcon } from '@hugeicons/svelte';` and `import { Search01Icon } from '@hugeicons/core-free-icons';` |
| `phosphor` | `phosphor-svelte` | `import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlass';` |
| `remixicon` | `remixicon-svelte` | `import RiSearchLine from 'remixicon-svelte/icons/search-line';` |

Hugeicons renders through one component: `<HugeiconsIcon icon={Search01Icon} />`.

Not `lucide-react`, `lucide-svelte` or `@tabler/icons-react`. To switch a project's library, run `npx @sveltery/ui@latest migrate icons --to <library>`.

---

## Icons in Button use data-icon attribute

Add `data-icon="inline-start"` (before the label) or `data-icon="inline-end"` (after it). No sizing or margin classes on the icon.

**Incorrect:**

```svelte
<Button>
  <SearchIcon class="mr-2 size-4" />
  Search
</Button>
```

**Correct:**

```svelte
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

<Button>
  Next
  <ArrowRightIcon data-icon="inline-end" />
</Button>
```

An icon-only button takes `size="icon"` (or `icon-xs`, `icon-sm`, `icon-lg`) and an `aria-label`, with no `data-icon`.

---

## No sizing classes on icons inside components

Components size their icons with CSS. Don't add `size-4`, `w-4 h-4` or other sizing classes to icons inside `Button`, `DropdownMenuItem`, `Alert`, `Sidebar*` or other components, unless the user asks for a custom size.

**Incorrect:**

```svelte
<DropdownMenuItem>
  <SettingsIcon class="mr-2 size-4" />
  Settings
</DropdownMenuItem>
```

**Correct:**

```svelte
<DropdownMenuItem>
  <SettingsIcon />
  Settings
</DropdownMenuItem>
```

---

## Pass icons as components, not string keys

A Svelte component is a value. Pass the icon component and render it as a tag.

**Incorrect:**

```svelte
<script lang="ts">
  import CheckIcon from '@lucide/svelte/icons/check';
  import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';

  const icons = { check: CheckIcon, alert: TriangleAlertIcon };
  let { icon }: { icon: keyof typeof icons } = $props();
  const Icon = $derived(icons[icon]);
</script>

<Icon />
```

**Correct:**

```svelte
<!-- StatusBadge.svelte -->
<script lang="ts">
  import type { Component } from 'svelte';

  let { icon: Icon, label }: { icon: Component; label: string } = $props();
</script>

<Badge variant="secondary"><Icon data-icon="inline-start" />{label}</Badge>
```

```svelte
<StatusBadge icon={CheckIcon} label="Done" />
```

---

## Icons in your own registry items

Write icons as `IconPlaceholder` with one attribute per library, so `add` swaps in the installing project's library. See [registry.md](../registry.md#writing-an-item).
