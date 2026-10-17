---
title: Checkbox
description: A control that allows the user to toggle between checked and not checked.
---

<ComponentPreview name="base/CheckboxExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add checkbox
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/checkbox`.

<ComponentSource name="checkbox" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Checkbox } from '#lib/components/ui/checkbox';
  import { Label } from '#lib/components/ui/label';
</script>
```

```svelte
<Checkbox id="terms" />
<Label for="terms">Accept terms and conditions</Label>
```

## Checked state

`Checkbox` works like an HTML checkbox. Use `defaultChecked` for the initial state, or `bind:checked` to read and set it.

```svelte
<script lang="ts">
  let checked = $state(false);
</script>

<Checkbox bind:checked />
```

## Forms

A checkbox with a `name` submits with its form, as `on` or its `value` when checked. An unchecked or disabled checkbox submits nothing.

```svelte
<form method="POST">
  <Checkbox name="terms" value="accepted" defaultChecked />
  <button type="submit">Save</button>
</form>
```

## Invalid state

Set `aria-invalid` on the checkbox to show the invalid styles.

```svelte
<Checkbox id="terms" aria-invalid="true" />
```

## Disabled

Set `disabled` to prevent interaction.

```svelte
<Checkbox id="toggle" disabled />
```

## Without JavaScript

`Checkbox` needs JavaScript for the keyboard and for a remote form's `as()` spread. For a form that must work before the page hydrates, use [Native Checkbox](/docs/components/native-checkbox), a styled native input that looks the same.

## API reference

`Checkbox` is styled on top of the Sveltery Base `Checkbox` primitive, which owns its behavior, form submission and accessibility. See the [Base UI Checkbox documentation](https://base-ui.com/react/components/checkbox) for the behavior it ports.
