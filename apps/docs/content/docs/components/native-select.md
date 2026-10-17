---
title: Native Select
description: A styled native HTML select element with consistent design system integration.
---

<ComponentPreview name="base/NativeSelectExample" />

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
  let status = $state('todo');
</script>
```

```svelte
<NativeSelect name="status" bind:value={status}>
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
