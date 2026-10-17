---
title: Native Switch
description: A styled native HTML checkbox that looks like the Switch and works without JavaScript.
---

<ComponentPreview name="base/NativeSwitchExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add native-switch
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Copy the component

Copy the following files into `src/lib/components/ui/native-switch`.

<ComponentSource name="native-switch" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { NativeSwitch } from '#lib/components/ui/native-switch';
  import { Label } from '#lib/components/ui/label';
</script>
```

```svelte
<div class="flex items-center gap-2">
  <NativeSwitch id="airplane-mode" name="airplane" />
  <Label for="airplane-mode">Airplane Mode</Label>
</div>
```

`NativeSwitch` is a real `<input type="checkbox" role="switch">`, and every prop goes on it. Mark the initial state with `defaultChecked`; `checked` sets the current state, which is what a remote form field passes. `size` takes `default` or `sm`.

The input is the track, and the thumb is a sibling that follows `:checked`. Both sit in a `<span>` that takes `class` and carries the Switch's `data-slot="switch"`, so a `Label` or `Field` styles itself as it does next to a Switch.

## When to use it

Use `NativeSwitch` when the form must work before the page hydrates or with JavaScript off. A click on the switch or its label, or <kbd>Space</kbd>, toggles it, and a checked switch submits with its form. Screen readers announce it as a switch.

[Switch](/docs/components/switch) runs on the Sveltery Base `Switch`, which also gives you Base UI state attributes such as `data-checked`, `bind:checked` and `onCheckedChange`, and Base's Field behavior.

## Remote forms

Spread a boolean [remote form](/docs/forms/remote-forms) field onto the switch with `as('checkbox')`. See the example on [Native Checkbox](/docs/components/native-checkbox#remote-forms).

```svelte
<Field orientation="horizontal">
  <FieldLabel for="digest">Weekly digest</FieldLabel>
  <NativeSwitch id="digest" {...f.fields.digest.as('checkbox')} />
</Field>
```
