---
title: Switch
description: A control that allows the user to toggle between checked and not checked.
---

<ComponentPreview name="base/SwitchExample" />

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
npm install cn @sveltery/base
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
  import { Switch } from '$lib/components/ui/switch';
  import { Label } from '$lib/components/ui/label';
</script>
```

```svelte
<div class="flex items-center gap-2">
  <Switch id="airplane-mode" />
  <Label for="airplane-mode">Airplane Mode</Label>
</div>
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

## Sizes

`size` is `sm` or `default`.

```svelte
<Switch size="sm" />
```

## API reference

`Switch` is styled on top of the Sveltery Base `Switch` primitive, which owns its state, keyboard behavior, form value and accessibility. See the [Base UI Switch documentation](https://base-ui.com/react/components/switch) for the behavior it ports.
