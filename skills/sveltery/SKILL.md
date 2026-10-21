---
name: sveltery
description: Manages Sveltery UI components and projects in Svelte 5 apps. Adds, searches, fixes, styles and composes components, including chat interfaces, with project context and component docs. Applies when working with Sveltery UI, @sveltery/ui, ui.sveltery.dev, or a components.json whose $schema or registry points at ui.sveltery.dev. Also triggers for "sveltery init", "init --preset" and "apply" with a Sveltery preset. Not for shadcn-svelte or React shadcn/ui projects.
user-invocable: false
allowed-tools: Bash(npx @sveltery/ui@latest *), Bash(pnpm dlx @sveltery/ui@latest *), Bash(bunx @sveltery/ui@latest *)
---

# Sveltery UI

Sveltery UI is an unfaithful Svelte 5 port of [shadcn/ui](https://ui.shadcn.com)'s Base UI variant, built on [Sveltery Base](https://github.com/sveltery/base), a Svelte port of [Base UI](https://base-ui.com). The CLI copies components into the user's project as source code they own.

> **Pre-1.0.** Sveltery UI changes quickly and this skill can lag behind it. The docs at [ui.sveltery.dev/llms.txt](https://ui.sveltery.dev/llms.txt) are the source of truth. When this skill and the docs disagree, follow the docs.

> **IMPORTANT:** Run the CLI with the project's package runner: `npx @sveltery/ui@latest`, `pnpm dlx @sveltery/ui@latest` or `bunx @sveltery/ui@latest`. Pick it from the lockfile (`pnpm-lock.yaml`, `bun.lock`, `package-lock.json`). Examples below use `npx @sveltery/ui@latest`.

## Current Project Context

```json
!`npx @sveltery/ui@latest info --json`
```

The JSON above holds the project, its `components.json` and the installed components. Run `npx @sveltery/ui@latest docs <component>` for a component's docs links.

## Principles

1. **Use existing components first.** Run `npx @sveltery/ui@latest search` before writing custom UI.
2. **Compose, don't reinvent.** Settings page = Tabs + Card + form controls. Dashboard = Sidebar + Card + Chart + Table.
3. **Use built-in variants before custom styles.** `variant="outline"`, `size="sm"` and so on.
4. **Use semantic colors.** `bg-primary`, `text-muted-foreground`. Never raw values like `bg-blue-500`.
5. **Write Svelte, not React.** `class`, `onclick`, `bind:value`, `bind:open`, snippets and attachments. Never `className`, `onClick`, `asChild`, `useState` or JSX.

## Critical Rules

These rules are **always enforced**. Each links to a file with Incorrect/Correct pairs.

### Styling & Tailwind → [styling.md](./rules/styling.md)

- **`class` for layout, not styling.** Never override component colors or typography.
- **No `space-x-*` or `space-y-*`.** Use `flex` with `gap-*`. For vertical stacks, `flex flex-col gap-*`.
- **Use `size-*` when width and height are equal.** `size-10`, not `w-10 h-10`.
- **Use `truncate`.** Not `overflow-hidden text-ellipsis whitespace-nowrap`.
- **No manual `dark:` color overrides.** Use semantic tokens.
- **Conditional classes use Svelte's `class` arrays or objects, or `cn()`.** No template-literal ternaries.
- **No manual `z-index` on overlay components.**

### Forms & Inputs → [forms.md](./rules/forms.md)

- **Forms use `FieldGroup` + `Field`.** Never a raw `div` with `space-y-*`.
- **Labels use `for`, not `htmlFor`.** `<FieldLabel for="email">` with `<Input id="email">`.
- **`InputGroup` uses `InputGroupInput`/`InputGroupTextarea`.** Never raw `Input`/`Textarea` inside `InputGroup`.
- **Buttons inside inputs use `InputGroup` + `InputGroupAddon`.**
- **Option sets (2–7 choices) use `ToggleGroup`.** Don't loop `Button` with manual active state.
- **`FieldSet` + `FieldLegend` group related checkboxes and radios.**
- **Validation uses `data-invalid` + `aria-invalid`.** `data-invalid` on `Field`, `aria-invalid` on the control. For disabled: `data-disabled` on `Field`, `disabled` on the control.
- **Form state lives in the form.** A native `<form>`, a SvelteKit remote form or a form action. There is no React Hook Form or TanStack Form layer.

### Component Structure → [composition.md](./rules/composition.md)

- **Items always inside their Group.** `SelectItem` → `SelectGroup`. `DropdownMenuItem` → `DropdownMenuGroup`. `CommandItem` → `CommandGroup`.
- **Custom triggers use a `render` snippet.** There is no `asChild`. See [composition.md](./rules/composition.md#custom-triggers-use-a-render-snippet).
- **Dialog, Sheet and Drawer always need a Title.** Use `class="sr-only"` if visually hidden.
- **Use full Card composition.** `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`.
- **Button has no `loading` prop.** Compose with `Spinner` + `data-icon` + `disabled`.
- **`TabsTrigger` must be inside `TabsList`.**
- **`Avatar` always needs `AvatarFallback`.**
- **Open state comes from `bind:open` or `bind:value`.** Not a `$state` copy synced in an `$effect`.

### Use Components, Not Custom Markup → [composition.md](./rules/composition.md)

- **Callouts use `Alert`.**
- **Empty states use `Empty`.**
- **Toasts use `toast.add()` from the `toast` component, with one `<Toaster />` in the root layout.** There is no Sonner.
- **Use `Separator`** instead of `<hr>` or `<div class="border-t">`.
- **Use `Skeleton`** for loading placeholders.
- **Use `Badge`** instead of custom styled spans.

### Icons → [icons.md](./rules/icons.md)

- **Icons in `Button` use `data-icon`.** `data-icon="inline-start"` or `data-icon="inline-end"`.
- **No sizing classes on icons inside components.**
- **Pass icons as components, not string keys.** `icon={CheckIcon}`, rendered as `<props.icon />`.
- **Import icons from the project's `iconLibrary`.** Lucide is `@lucide/svelte`, never `lucide-react` or `lucide-svelte`.

### Chat & Messaging → [chat.md](./rules/chat.md)

- **Chat UI composes the chat components.** `MessageScroller` for the thread, `Message` for rows, `Bubble` for surfaces.
- **`MessageScroller` owns scrolling.** Use `autoScroll`, `scrollAnchor` and `MessageScrollerButton`. No hand-written stick-to-bottom code.
- **Attachments use `Attachment`. Dividers and system notes use `Marker`. Reasoning and tool calls use `Trace`.**

### CLI

- **Never decode preset codes or build preset URLs by hand.** Use `preset decode`, `preset url`, `preset open` or `preset resolve`.
- **Apply presets with the CLI.** `apply <code>` in an existing project, or `init --preset <code>`.

## Key Patterns

```svelte
<!-- Form layout: FieldGroup + Field, not div + Label. -->
<FieldGroup>
  <Field>
    <FieldLabel for="email">Email</FieldLabel>
    <Input id="email" name="email" type="email" />
  </Field>
</FieldGroup>

<!-- Validation: data-invalid on Field, aria-invalid on the control. -->
<Field data-invalid={emailInvalid}>
  <FieldLabel for="email">Email</FieldLabel>
  <Input id="email" aria-invalid={emailInvalid} />
  <FieldError>Enter a valid email.</FieldError>
</Field>

<!-- Icons in buttons: data-icon, no sizing classes. -->
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

<!-- A Button as a trigger: a render snippet, not asChild. -->
<DialogTrigger>
  {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
  Edit profile
</DialogTrigger>

<!-- Spacing: gap-*, not space-y-*. -->
<div class="flex flex-col gap-4"></div>  <!-- correct -->
<div class="space-y-4"></div>            <!-- wrong -->

<!-- Status colors: Badge variants or semantic tokens, not raw colors. -->
<Badge variant="secondary">+20.1%</Badge>      <!-- correct -->
<span class="text-emerald-600">+20.1%</span>  <!-- wrong -->
```

## Component Selection

| Need | Use |
| --- | --- |
| Button or action | `Button` with a variant |
| Form inputs | `Input`, `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Textarea`, `InputOTP`, `Slider` |
| Inputs that work before hydration | `NativeSelect`, `NativeCheckbox`, `NativeSwitch`, `NativeRadioGroup`, `NativeSlider` |
| Toggle between 2–5 options | `ToggleGroup` + `ToggleGroupItem` |
| Data display | `Table`, `DataTable`, `Card`, `Badge`, `Avatar`, `Item` |
| Navigation | `Sidebar`, `NavigationMenu`, `Breadcrumb`, `Tabs`, `Pagination` |
| Overlays | `Dialog` (modal), `Sheet` (side panel), `Drawer` (bottom sheet), `AlertDialog` (confirmation) |
| Feedback | `toast`, `Alert`, `Progress`, `Skeleton`, `Spinner` |
| Command palette | `Command` inside `Dialog` |
| Charts | `Chart` |
| Layout | `Card`, `Separator`, `Resizable`, `ScrollArea`, `Accordion`, `Collapsible` |
| Empty states | `Empty` |
| Menus | `DropdownMenu`, `ContextMenu`, `Menubar` |
| Tooltips and info | `Tooltip`, `HoverCard`, `Popover` |
| Code | `CodeBlock` |
| Chat and conversation UI | `MessageScroller`, `Message`, `Bubble`, `Attachment`, `Marker`, `Trace` |

## Key Fields

The injected context has `project`, `config`, `preset`, `components` and `links`. `project` and `config` are `null` when there is no `package.json` or `components.json`.

- **`config.aliases`** → import prefixes. `ui` is often `#lib/components/ui` (SvelteKit 3) or `$lib/components/ui`. Never hardcode one.
- **`config.resolvedPaths`** → absolute paths for `ui`, `components`, `utils`, `lib`, `hooks` and `tailwindCss`.
- **`config.resolvedPaths.tailwindCss`** → the CSS file that holds the theme tokens. Edit it. Never create a new one.
- **`config.style`** → the visual style: `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`, `sera` or `rhea`.
- **`config.iconLibrary`** → `lucide`, `tabler`, `hugeicons`, `phosphor` or `remixicon`. See [icons.md](./rules/icons.md).
- **`config.rtl`** → when `true`, use logical classes (`ms-2`, `start-0`), not physical ones.
- **`project.framework`** → `SvelteKit`, `Vite` or `Manual`. Routing, `+page.svelte` files and form actions exist only in SvelteKit.
- **`project.importAlias`** → `$lib` or `#lib` in a SvelteKit app.
- **`components`** → installed items. Don't import what isn't installed, and don't re-add what is.

There is no `packageManager`, `isRSC` or `base` field. Svelte has no server components, and Base UI is the only base. See [cli.md](./cli.md#info-project-information) for every field.

## Component Docs, Examples, and Usage

Run `npx @sveltery/ui@latest docs <component>` to get a component's links, then fetch them:

```bash
npx @sveltery/ui@latest docs button dialog select
```

- `docs` is the page on ui.sveltery.dev.
- `examples` is the same page as Markdown, with every example's source inlined. Fetch this one.
- `api` is the Base UI API reference that the component's behavior ports, as Markdown.

Every docs page has a Markdown twin at `https://ui.sveltery.dev/docs/<page>.md`, and [llms.txt](https://ui.sveltery.dev/llms.txt) lists them all.

**When you create, fix, debug or use a component, run `docs` and fetch the `examples` URL first.** It shows the Svelte API. Do not guess it from shadcn/ui's React code.

## Workflow

1. **Get project context.** It is injected above. Run `npx @sveltery/ui@latest info --json` to refresh it.
2. **Check installed components.** Read `components` or list `resolvedPaths.ui` before you run `add`.
3. **Find components.** `npx @sveltery/ui@latest search @sveltery -q <query>`.
4. **Get docs and examples.** `npx @sveltery/ui@latest docs <component>`, then fetch the `examples` URL. Use `view` for raw registry items.
5. **Install or update.** `npx @sveltery/ui@latest add <component>`. Preview with `--dry-run`, `--diff` or `--view` first when files exist. See [Updating Components](#updating-components).
6. **Fix imports in third-party items.** Items from other registries may hardcode `$lib/components/ui/...`. Rewrite them to `config.aliases.ui`.
7. **Review added files.** Check for missing parts, wrong composition, React idioms and [Critical Rules](#critical-rules) violations. Swap icon imports to the project's `iconLibrary`.
8. **Registry must be explicit.** When the user asks for a block or component from another registry without naming it, ask which one. Never guess.
9. **Switching presets.** Ask first: **overwrite**, **partial** or **skip**?
   - **Inspect the current preset**: `npx @sveltery/ui@latest preset resolve`. Add `--json` for structured values.
   - **Inspect a preset code**: `npx @sveltery/ui@latest preset decode <code>`.
   - **Overwrite**: `npx @sveltery/ui@latest apply <code>`. Rewrites the theme, fonts and every installed component.
   - **Partial**: `npx @sveltery/ui@latest apply <code> --only theme,font`. Leaves components alone. `--only` takes `theme`, `font` or both.
   - **Skip components**: `npx @sveltery/ui@latest init --preset <code>`. Rewrites `components.json` and the theme, and leaves installed components as they are.
   - Run preset commands in the project directory. `apply` needs a `components.json`.

## Updating Components

When the user wants upstream changes and their own edits kept, preview and merge. **Never fetch raw files from GitHub. Use the CLI.**

1. `npx @sveltery/ui@latest diff <component>` shows how the registry differs from the local files. Your file is the `a/` side.
2. `npx @sveltery/ui@latest add <component> --diff <file>` shows one file.
3. Decide per file:
   - No local changes → overwrite.
   - Local changes → read the local file and apply the upstream changes by hand, keeping the edits.
   - The user says "update everything" → `npx @sveltery/ui@latest update`, which asks per file. Confirm with the user before `update --yes` or `add --overwrite`.

## Quick Reference

```bash
# Set up an existing SvelteKit or Vite app.
npx @sveltery/ui@latest init
npx @sveltery/ui@latest init --preset sera
npx @sveltery/ui@latest init -y --style nova --icons lucide --base-color neutral

# Create a SvelteKit monorepo.
npx @sveltery/ui@latest init --monorepo --name my-app

# Apply a preset to an existing project.
npx @sveltery/ui@latest apply b4xFeBLg4O
npx @sveltery/ui@latest apply b4xFeBLg4O --only theme,font

# Inspect presets.
npx @sveltery/ui@latest preset decode b4xFeBLg4O
npx @sveltery/ui@latest preset url b4xFeBLg4O
npx @sveltery/ui@latest preset resolve --json

# Add components.
npx @sveltery/ui@latest add button card dialog
npx @sveltery/ui@latest add @acme/hello-card
npx @sveltery/ui@latest add acme/ui/hello-card#v1.0
npx @sveltery/ui@latest add --all

# Preview before adding or updating.
npx @sveltery/ui@latest add button --dry-run
npx @sveltery/ui@latest add button --diff Button.svelte
npx @sveltery/ui@latest add button --view
npx @sveltery/ui@latest diff
npx @sveltery/ui@latest update button

# Search registries.
npx @sveltery/ui@latest search @sveltery -q sidebar
npx @sveltery/ui@latest search @sveltery -q login -t block
npx @sveltery/ui@latest search @acme -q card --json

# Docs links and raw registry items.
npx @sveltery/ui@latest docs button dialog select
npx @sveltery/ui@latest view button
```

**Styles:** `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`, `sera`, `rhea`.
**Preset codes:** opaque strings such as `b4xFeBLg4O`, from the [Create page](https://ui.sveltery.dev/create).

## Detailed References

- [rules/forms.md](./rules/forms.md): FieldGroup, Field, InputGroup, ToggleGroup, FieldSet, validation, SvelteKit forms
- [rules/composition.md](./rules/composition.md): render snippets, groups, overlays, Card, Tabs, Avatar, Alert, Empty, Toast, Separator, Skeleton, Badge, Button loading
- [rules/chat.md](./rules/chat.md): MessageScroller, Message, Bubble, Attachment, Marker, Trace
- [rules/icons.md](./rules/icons.md): data-icon, icon sizing, icon packages
- [rules/styling.md](./rules/styling.md): semantic colors, variants, `class`, spacing, size, truncate, dark mode, conditional classes, z-index
- [cli.md](./cli.md): commands, flags, presets
- [registry.md](./registry.md): building and serving your own registry
- [customization.md](./customization.md): theming, CSS variables, extending components
- [Differences from shadcn/ui](https://ui.sveltery.dev/docs/differences.md): every deliberate difference from upstream
