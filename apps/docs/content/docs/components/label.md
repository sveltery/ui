---
title: Label
description: Renders an accessible label associated with controls.
---

<ComponentPreview name="base/LabelDemoExample" />

<Callout>

For form fields, use the [Field](/docs/components/field) component which includes built-in label, description, and error handling.

</Callout>

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add label
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/label`.

<ComponentSource name="label" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Label } from '#lib/components/ui/label';
</script>
```

```svelte
<Label for="email">Your email address</Label>
```

## Label in Field

For form fields, use the [Field](/docs/components/field) component which includes built-in `FieldLabel`, `FieldDescription`, and `FieldError` components.

```svelte
<Field>
  <FieldLabel for="email">Your email address</FieldLabel>
  <Input id="email" />
</Field>
```

<ComponentPreview name="base/FieldDemoExample" />

## RTL

Wrap the label and its control in a [DirectionProvider](/docs/components/direction) and set `dir` on both. Use the buttons to switch the language.

<ComponentPreview name="base/LabelRtlExample" align="start" />

## API Reference

`Label` renders a native `<label>` element and takes its attributes, such as `for`.
