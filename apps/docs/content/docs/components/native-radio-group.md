---
title: Native Radio Group
description: Styled native HTML radio buttons that look like the Radio Group and work without JavaScript.
---

<ComponentPreview name="base/NativeRadioGroupExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add native-radio-group
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn
```

### Copy the component

Copy the following files into `src/lib/components/ui/native-radio-group`.

<ComponentSource name="native-radio-group" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { NativeRadio, NativeRadioGroup } from '#lib/components/ui/native-radio-group';
  import { Label } from '#lib/components/ui/label';
</script>
```

```svelte
<NativeRadioGroup aria-label="Density">
  <div class="flex items-center gap-2">
    <NativeRadio name="density" value="default" id="r1" />
    <Label for="r1">Default</Label>
  </div>
  <div class="flex items-center gap-2">
    <NativeRadio name="density" value="comfortable" id="r2" defaultChecked />
    <Label for="r2">Comfortable</Label>
  </div>
</NativeRadioGroup>
```

`NativeRadio` is a real `<input type="radio">`, and every prop goes on it. Give the radios of one group the same `name`. Mark the initial choice with `defaultChecked`. A form reset returns to it, as it does for a native radio. `checked` sets the current choice, which is what a remote form field passes.

## When to use it

Use `NativeRadioGroup` when the form must work before the page hydrates or with JavaScript off. The browser does all of the work:

- A click or tap on the radio or its label picks it.
- The arrow keys move the choice, and the group is one tab stop.
- The checked radio submits with its form.

[Radio Group](/docs/components/radio-group) runs on the Sveltery Base `RadioGroup`, which renders a `<span>` and a hidden input. Without JavaScript, only a click on its label picks a radio there, and the keyboard does nothing. Radio Group also gives you what `NativeRadioGroup` does not have:

- Base UI state attributes, such as `data-checked` and `data-disabled`, to style on. Style `NativeRadio` with `checked:`, `disabled:` and `aria-invalid:` instead.
- `bind:value` and `onValueChange` for the group's value.
- Base's Field behavior: validation, `data-dirty` and `data-touched`, and Form `errors`.
- `Radio.Indicator` and its animations. The dot of `NativeRadio` is a background.

The [Field](/docs/components/field) layout parts, such as `Field`, `FieldLabel`, `FieldSet` and `FieldError`, work with both.

## Remote forms

Spread a [remote form](/docs/forms/remote-forms) field onto each radio with `as('radio', value)`. The field gives each radio its `name`, `value`, `checked` state and `aria-invalid`.

<ComponentPreview name="forms/NativeRadioRemoteExample" />

```svelte
<script lang="ts">
  import { Button } from '#lib/components/ui/button';
  import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from '#lib/components/ui/field';
  import { NativeRadio, NativeRadioGroup } from '#lib/components/ui/native-radio-group';
  import { planSchema, plans } from '#lib/forms/plan';
  import { choosePlan } from '#lib/forms/plan.remote';

  const f = choosePlan.preflight(planSchema);
</script>

<form {...f}>
  <FieldSet>
    <FieldLegend>Plan</FieldLegend>
    <NativeRadioGroup>
      {#each plans as plan (plan)}
        <Field orientation="horizontal" data-invalid={!!f.fields.plan.issues()}>
          <NativeRadio id="plan-{plan}" {...f.fields.plan.as('radio', plan)} />
          <FieldLabel for="plan-{plan}" class="font-normal">{plan}</FieldLabel>
        </Field>
      {/each}
    </NativeRadioGroup>
    <FieldError errors={f.fields.plan.issues()} />
  </FieldSet>
  <Button type="submit" disabled={f.pending > 0}>Choose plan</Button>
</form>
```

Without JavaScript, the form posts to the server, and the page comes back with the submitted radio checked and the issue shown.
