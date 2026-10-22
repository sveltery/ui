---
title: Radio Group
description: A set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.
---

<ComponentPreview name="base/RadioGroupDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add radio-group
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/radio-group`.

<ComponentSource name="radio-group" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { RadioGroup, RadioGroupItem } from '#lib/components/ui/radio-group';
  import { Label } from '#lib/components/ui/label';
</script>
```

```svelte
<RadioGroup defaultValue="option-one">
  <div class="flex items-center gap-3">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label for="option-one">Option One</Label>
  </div>
  <div class="flex items-center gap-3">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label for="option-two">Option Two</Label>
  </div>
</RadioGroup>
```

Bind `value` to read or change the selection.

```svelte
<script lang="ts">
  let density = $state("comfortable");
</script>

<RadioGroup bind:value={density}>...</RadioGroup>
```

## Without JavaScript

`RadioGroup` needs JavaScript for the keyboard and for a remote form's `as()` spread. For a form that must work before the page hydrates, use [Native Radio Group](/docs/components/native-radio-group), a styled native input that looks the same.

## Composition

Use the following composition to build a `RadioGroup`:

```text
RadioGroup
├── RadioGroupItem
└── RadioGroupItem
```

## Description

Radio group items with a description using the `Field` component.

<ComponentPreview name="base/RadioGroupDescriptionExample" />

## Choice Card

Use `FieldLabel` to wrap the entire `Field` for a clickable card-style selection.

<ComponentPreview name="base/RadioGroupChoiceCardExample" />

## Fieldset

Use `FieldSet` and `FieldLegend` to group radio items with a label and description.

<ComponentPreview name="base/RadioGroupFieldsetExample" />

## Disabled

Use the `disabled` prop on `RadioGroup` to disable all items.

<ComponentPreview name="base/RadioGroupDisabledExample" />

## Invalid

Use `aria-invalid` on `RadioGroupItem` and `invalid` on `Field` to show validation errors.

<ComponentPreview name="base/RadioGroupInvalidExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the radio group in a [DirectionProvider](/docs/components/direction) and set `dir` on `RadioGroup`, `RadioGroupItem`, `FieldLabel` and `FieldDescription`. Use the language selector to switch the language.

<ComponentPreview name="base/RadioGroupRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI Radio Group](https://base-ui.com/react/components/radio-group#api-reference) documentation.

`RadioGroup` is styled on top of the Sveltery Base `RadioGroup` and `Radio` primitives, which own the selection, arrow-key navigation and the hidden inputs that take part in form submission. `RadioGroup` keeps the HTML form semantics: `name` submits the checked value, `defaultValue` sets the initial selection, and `bind:value` shares it with the parent.
