---
title: Native Select
description: A styled native HTML select element with consistent design system integration.
---

<script lang="ts">
  import InfoIcon from '@lucide/svelte/icons/info';
</script>

<Callout variant="info">
{#snippet icon()}<InfoIcon class="translate-y-[3px]!" />{/snippet}

For a styled select component, see the [Select](/docs/components/select) component.

</Callout>

<ComponentPreview name="base/NativeSelectDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add native-select
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/native-select`.

<ComponentSource name="native-select" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { NativeSelect, NativeSelectOption } from '#lib/components/ui/native-select';
</script>
```

```svelte
<NativeSelect>
  <NativeSelectOption value="">Select a fruit</NativeSelectOption>
  <NativeSelectOption value="apple">Apple</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
  <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
  <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
</NativeSelect>
```

## Binding a value

Use `bind:value` to read and set the selected option's value.

```svelte
<script lang="ts">
  let status = $state('todo');
</script>

<NativeSelect bind:value={status}>
  <NativeSelectOption value="todo">Todo</NativeSelectOption>
  <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
  <NativeSelectOption value="done">Done</NativeSelectOption>
</NativeSelect>
```

## Forms

`NativeSelect` is a real `<select>`, so it submits with its form and resets like one. A form reset selects the option marked `selected` in the markup, or the first option when none is.

```svelte
<form method="POST">
  <NativeSelect name="priority">
    <NativeSelectOption value="low">Low</NativeSelectOption>
    <NativeSelectOption value="medium" selected>Medium</NativeSelectOption>
    <NativeSelectOption value="high">High</NativeSelectOption>
  </NativeSelect>
  <button type="reset">Reset</button>
</form>
```

## Multiple

Add `multiple` to show a list box that picks several options. The chevron hides, and the select grows to show its options. Mark the initial picks with `selected`.

```svelte
<NativeSelect name="fruits" multiple>
  <NativeSelectOption value="apple" selected>Apple</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
  <NativeSelectOption value="grapes" selected>Grapes</NativeSelectOption>
</NativeSelect>
```

## Remote forms

Spread a [remote form](/docs/forms/remote-forms) field onto the select with `as('select')`, or with `as('select multiple')` for a list. This example also has toggle-style checkboxes and radios, which take `as('checkbox', value)` and `as('radio', value)`.

<ComponentPreview name="forms/ChoicesRemoteExample" />

```svelte
<form {...f}>
  <Field data-invalid={!!f.fields.fruits.issues()}>
    <FieldLabel for="fruits">Fruits</FieldLabel>
    <NativeSelect id="fruits" {...f.fields.fruits.as('select multiple')}>
      {#each fruits as fruit (fruit)}
        <NativeSelectOption value={fruit}>{fruit}</NativeSelectOption>
      {/each}
    </NativeSelect>
    <FieldError errors={f.fields.fruits.issues()} />
  </Field>
  <div class="flex gap-1">
    {#each textStyles as style (style)}
      <label class={toggle}><input class="sr-only" {...f.fields.styles.as('checkbox', style)} />{style}</label>
    {/each}
  </div>
  <Button type="submit">Save</Button>
</form>
```

## Composition

### Simple

Options placed directly under `NativeSelect` (no `NativeSelectOptGroup`).

```text
NativeSelect
├── NativeSelectOption
├── NativeSelectOption
├── NativeSelectOption
└── NativeSelectOption
```

### With groups

Use `NativeSelectOptGroup` to organize options into categories.

```text
NativeSelect
├── NativeSelectOptGroup
│   ├── NativeSelectOption
│   └── NativeSelectOption
└── NativeSelectOptGroup
    ├── NativeSelectOption
    └── NativeSelectOption
```

## Groups

Use `NativeSelectOptGroup` to organize options into categories.

<ComponentPreview name="base/NativeSelectGroupsExample" />

## Disabled

Add the `disabled` prop to the `NativeSelect` component to disable the select.

<ComponentPreview name="base/NativeSelectDisabledExample" />

## Invalid

Use `aria-invalid` to show validation errors and the `data-invalid` attribute to the `Field` component for styling.

<ComponentPreview name="base/NativeSelectInvalidExample" />

## Native Select vs Select

- Use `NativeSelect` for native browser behavior, better performance, or mobile-optimized dropdowns.
- Use `Select` for custom styling, animations, or complex interactions.

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the select in a [DirectionProvider](/docs/components/direction) and set `dir` on `NativeSelect`. Use the language selector to switch the language.

<ComponentPreview name="base/NativeSelectRtlExample" direction="rtl" align="start" />

## API Reference

### NativeSelect

The main select component that wraps the native HTML select element.

```svelte
<NativeSelect>
  <NativeSelectOption value="option1">Option 1</NativeSelectOption>
  <NativeSelectOption value="option2">Option 2</NativeSelectOption>
</NativeSelect>
```

### NativeSelectOption

Represents an individual option within the select.

| Prop       | Type      | Default |
| ---------- | --------- | ------- |
| `value`    | `string`  |         |
| `disabled` | `boolean` | `false` |

### NativeSelectOptGroup

Groups related options together for better organization.

| Prop       | Type      | Default |
| ---------- | --------- | ------- |
| `label`    | `string`  |         |
| `disabled` | `boolean` | `false` |

```svelte
<NativeSelectOptGroup label="Fruits">
  <NativeSelectOption value="apple">Apple</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
</NativeSelectOptGroup>
```
