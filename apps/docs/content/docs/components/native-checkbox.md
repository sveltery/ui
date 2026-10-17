---
title: Native Checkbox
description: A styled native HTML checkbox that looks like the Checkbox and works without JavaScript.
---

<ComponentPreview name="base/NativeCheckboxExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add native-checkbox
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn
```

### Copy the component

Copy the following files into `src/lib/components/ui/native-checkbox`.

<ComponentSource name="native-checkbox" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { NativeCheckbox } from '#lib/components/ui/native-checkbox';
  import { Label } from '#lib/components/ui/label';
</script>
```

```svelte
<div class="flex items-center gap-2">
  <NativeCheckbox id="terms" name="terms" defaultChecked />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

`NativeCheckbox` is a real `<input type="checkbox">`, and every prop goes on it. Mark the initial state with `defaultChecked`. A form reset returns to it, as it does for a native checkbox. `checked` sets the current state, which is what a remote form field passes.

The input sits in a `<span>` that draws the check icon over it. `class` goes on that `<span>`, which carries the Checkbox's `data-slot="checkbox"`, so a `Label` or `Field` styles itself as it does next to a Checkbox. Style the box with `checked:`, `disabled:` and `aria-invalid:` on the input, through a selector such as `[&_input]:`.

## When to use it

Use `NativeCheckbox` when the form must work before the page hydrates or with JavaScript off. The browser does all of the work:

- A click or tap on the checkbox or its label toggles it.
- <kbd>Space</kbd> toggles it, and each checkbox is one tab stop.
- A checked checkbox submits its `value`, or `on`, with its form.

[Checkbox](/docs/components/checkbox) runs on the Sveltery Base `Checkbox`, which renders a `<span>` and a hidden input. Without JavaScript, the keyboard does nothing there. Checkbox also gives you what `NativeCheckbox` does not have:

- Base UI state attributes, such as `data-checked` and `data-disabled`, to style on.
- `bind:checked` and `onCheckedChange`.
- The indeterminate state, and a parent checkbox for a group.
- Base's Field behavior: validation, `data-dirty` and `data-touched`, and Form `errors`.

## Group

For a group of checkboxes that submit one list, give each the same `name` and its own `value`, and put them in a `FieldSet` with a `FieldLegend`.

```svelte
<FieldSet>
  <FieldLegend variant="label">Show these items on the desktop:</FieldLegend>
  {#each items as item (item.value)}
    <Field orientation="horizontal">
      <NativeCheckbox id="desktop-{item.value}" name="desktop" value={item.value} />
      <FieldLabel for="desktop-{item.value}" class="font-normal">{item.label}</FieldLabel>
    </Field>
  {/each}
</FieldSet>
```

## Toggle style

To make choices look like a [Toggle Group](/docs/components/toggle-group) and still work without JavaScript, hide a plain checkbox inside a label that has the Toggle's classes. `has-checked:` styles the label from its checkbox's state. Use radios the same way for a single choice; see [Native Radio Group](/docs/components/native-radio-group).

```svelte
<script lang="ts">
  import { toggleVariants } from '#lib/components/ui/toggle';
  import { cn } from 'cn';

  const toggle = cn(toggleVariants({ variant: 'outline' }), 'cursor-pointer has-checked:bg-muted has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50');
</script>

<fieldset class="flex gap-1">
  <legend class="sr-only">Text style</legend>
  <label class={toggle}><input class="sr-only" type="checkbox" name="style" value="bold" />Bold</label>
  <label class={toggle}><input class="sr-only" type="checkbox" name="style" value="italic" />Italic</label>
</fieldset>
```

## Remote forms

Spread a [remote form](/docs/forms/remote-forms) field onto a checkbox with `as('checkbox')` for a boolean, or with `as('checkbox', value)` for each option of a list. The field gives the checkbox its `name`, `value`, `checked` state and `aria-invalid`. [Native Switch](/docs/components/native-switch) and [Native Slider](/docs/components/native-slider) take their fields the same way.

<ComponentPreview name="forms/NativeControlsRemoteExample" />

```svelte
<script lang="ts">
  import { Button } from '#lib/components/ui/button';
  import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from '#lib/components/ui/field';
  import { NativeCheckbox } from '#lib/components/ui/native-checkbox';
  import { preferencesSchema, topics } from '#lib/forms/preferences';
  import { savePreferences } from '#lib/forms/preferences.remote';

  const f = savePreferences.preflight(preferencesSchema);
</script>

<form {...f}>
  <FieldSet>
    <FieldLegend variant="label">Email me about</FieldLegend>
    {#each topics as topic (topic)}
      <Field orientation="horizontal">
        <NativeCheckbox id="topic-{topic}" {...f.fields.topics.as('checkbox', topic)} />
        <FieldLabel for="topic-{topic}" class="font-normal">{topic}</FieldLabel>
      </Field>
    {/each}
    <FieldError errors={f.fields.topics.issues()} />
  </FieldSet>
  <Field orientation="horizontal" data-invalid={!!f.fields.terms.issues()}>
    <NativeCheckbox id="terms" {...f.fields.terms.as('checkbox')} />
    <FieldLabel for="terms">Accept the terms</FieldLabel>
  </Field>
  <Button type="submit" disabled={f.pending > 0}>Save</Button>
</form>
```

Without JavaScript, the form posts to the server, and the page comes back with the submitted checkboxes checked and the issues shown.
