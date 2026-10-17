---
title: Checkbox
description: A control that allows the user to toggle between checked and not checked.
---

<ComponentPreview name="base/CheckboxDemoExample" />

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

## Checked State

Use `defaultChecked` for uncontrolled checkboxes, or `bind:checked` to control the state.

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

## Invalid State

Set `aria-invalid` on the checkbox and `data-invalid` on the field wrapper to show the invalid styles.

<ComponentPreview name="base/CheckboxInvalidExample" />

## Basic

Pair the checkbox with `Field` and `FieldLabel` for proper layout and labeling.

<ComponentPreview name="base/CheckboxBasicExample" />

## Description

Use `FieldContent` and `FieldDescription` for helper text.

<ComponentPreview name="base/CheckboxDescriptionExample" />

## Disabled

Use the `disabled` prop to prevent interaction and add the `data-disabled` attribute to the `<Field>` component for disabled styles.

<ComponentPreview name="base/CheckboxDisabledExample" />

## Group

Use multiple fields to create a checkbox list.

<ComponentPreview name="base/CheckboxGroupExample" />

## Table

<ComponentPreview name="base/CheckboxTableExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the checkboxes in a [DirectionProvider](/docs/components/direction) and set `dir` on the field group. Use the language selector to switch the language.

<ComponentPreview name="base/CheckboxRtlExample" direction="rtl" />

## Without JavaScript

`Checkbox` needs JavaScript for the keyboard and for a remote form's `as()` spread. For a form that must work before the page hydrates, use [Native Checkbox](/docs/components/native-checkbox), a styled native input that looks the same.

## API Reference

See the [Base UI Checkbox](https://base-ui.com/react/components/checkbox#api-reference) documentation.

`Checkbox` is styled on top of the Sveltery Base `Checkbox` primitive, which owns its behavior, form submission and accessibility.
