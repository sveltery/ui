---
title: Switch
description: A control that allows the user to toggle between checked and not checked.
---

<ComponentPreview name="base/SwitchDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add switch
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/switch`.

<ComponentSource name="switch" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Switch } from '#lib/components/ui/switch';
  import { Label } from '#lib/components/ui/label';
</script>
```

```svelte
<Switch />
```

## Checked state

Bind `checked` to read and write the state. `defaultChecked` is the state an unbound switch starts from, as on an HTML checkbox.

```svelte
<script lang="ts">
  let enabled = $state(false);
</script>

<Switch bind:checked={enabled} />
<Switch defaultChecked />
```

## Forms

`Switch` renders a hidden checkbox, so it submits with its form. A checked switch submits `value` (default `on`) under `name`.

```svelte
<form method="POST">
  <Switch name="notifications" value="enabled" defaultChecked />
  <button type="submit">Save</button>
</form>
```

## Without JavaScript

`Switch` needs JavaScript for the keyboard and for a remote form's `as()` spread. For a form that must work before the page hydrates, use [Native Switch](/docs/components/native-switch), a styled native input that looks the same.

## Description

<ComponentPreview name="base/SwitchDescriptionExample" />

## Choice Card

Card-style selection where `FieldLabel` wraps the entire `Field` for a clickable card pattern.

<ComponentPreview name="base/SwitchChoiceCardExample" />

## Disabled

Add the `disabled` prop to the `Switch` component to disable the switch. Add the `data-disabled` prop to the `Field` component for styling.

<ComponentPreview name="base/SwitchDisabledExample" />

## Invalid

Add the `aria-invalid` prop to the `Switch` component to indicate an invalid state. Set `invalid` on the `Field` component for styling.

<ComponentPreview name="base/SwitchInvalidExample" />

## Size

Use the `size` prop to change the size of the switch.

<ComponentPreview name="base/SwitchSizesExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the switch in a [DirectionProvider](/docs/components/direction) and set `dir` on the field parts and the switch. Use the language selector to switch the language.

<ComponentPreview name="base/SwitchRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI Switch](https://base-ui.com/react/components/switch#api-reference) documentation.

`Switch` is styled on top of the Sveltery Base `Switch` primitive, which owns its state, keyboard behavior, form value and accessibility. `size` is `sm` or `default`.
