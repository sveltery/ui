---
title: Textarea
description: Displays a form textarea or a component that looks like a textarea.
---

<ComponentPreview name="base/TextareaDemoExample" class="[&_[data-slot=textarea]]:max-w-xs" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add textarea
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/textarea`.

<ComponentSource name="textarea" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Textarea } from '#lib/components/ui/textarea';
</script>
```

```svelte
<Textarea />
```

## Value

Bind `value` to read and write the text. A `name` makes the textarea submit with its form.

```svelte
<script lang="ts">
  let message = $state('');
</script>

<Textarea name="message" bind:value={message} />
```

## Field

Use `Field`, `FieldLabel`, and `FieldDescription` to create a textarea with a label and description.

<ComponentPreview name="base/TextareaFieldExample" class="[&_[data-slot=field]]:max-w-xs" />

## Disabled

Use the `disabled` prop to disable the textarea. To style the disabled state, add the `data-disabled` attribute to the `Field` component.

<ComponentPreview name="base/TextareaDisabledExample" class="[&_[data-slot=field]]:max-w-xs" />

## Invalid

Use the `aria-invalid` prop to mark the textarea as invalid. To style the invalid state, add the `data-invalid` attribute to the `Field` component.

<ComponentPreview name="base/TextareaInvalidExample" class="[&_[data-slot=field]]:max-w-xs" />

## Button

Pair with `Button` to create a textarea with a submit button.

<ComponentPreview name="base/TextareaButtonExample" class="[&_.grid]:max-w-xs" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the field in a [DirectionProvider](/docs/components/direction) and set `dir` on `Field`, `FieldLabel`, `Textarea` and `FieldDescription`. Use the language selector to switch the language.

<ComponentPreview name="base/TextareaRtlExample" direction="rtl" align="start" />
