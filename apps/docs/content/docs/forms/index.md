---
title: Forms
description: Build forms with Field, native validation, SvelteKit remote forms and form actions.
---

Forms build on [Field](/docs/components/field). As in shadcn/ui, `Field` holds no form state. You give each control its `name`, link each label to its control with `for` and `id`, and mark a field invalid yourself with `data-invalid` on `Field` and `aria-invalid` on the control.

A form owns its state in one of these places:

- **The form itself.** A native `<form>` submits each named control. This page shows it.
- **A SvelteKit remote form.** See [Remote forms](/docs/forms/remote-forms).
- **A SvelteKit form action.** See [Form actions](/docs/forms/form-actions).

<ComponentPreview name="forms/CompositeFieldsExample" />

## Usage

```svelte
<script lang="ts">
  import { Button } from '#lib/components/ui/button';
  import { Field, FieldLabel } from '#lib/components/ui/field';
  import { Input } from '#lib/components/ui/input';
</script>

<form onsubmit={(event) => console.log(Object.fromEntries(new FormData(event.currentTarget)))}>
  <Field>
    <FieldLabel for="email">Email</FieldLabel>
    <Input id="email" name="email" type="email" required />
  </Field>
  <Button type="submit">Subscribe</Button>
</form>
```

## Validation

The controls take the native validation attributes: `required`, `pattern`, `minlength`, `maxlength`, `min`, `max` and `step`. The browser checks them before a submit.

For a rule of your own, check the value in your submit handler. When it fails, set `data-invalid` on `Field` and `aria-invalid` on the control, and show the message in `FieldError`:

```svelte
<Field orientation="horizontal" data-invalid={termsInvalid}>
  <Checkbox id="terms" name="terms" aria-invalid={termsInvalid} />
  <FieldLabel for="terms">Accept the terms</FieldLabel>
  {#if termsInvalid}
    <FieldError>Accept the terms to continue.</FieldError>
  {/if}
</Field>
```

## Composite controls

[Checkbox](/docs/components/checkbox), [Switch](/docs/components/switch), [Radio Group](/docs/components/radio-group) and [Slider](/docs/components/slider) each submit through a hidden native input under their `name`. Give the control an `id` and its `FieldLabel` a matching `for`. For a radio group, put `name` on `RadioGroup`, and give each option its own horizontal `Field` and label.

## Without JavaScript

The composite controls need JavaScript for the keyboard and for a remote form's `as()` spread. For a form that must work before the page hydrates, use their native twins, which look the same: [Native Checkbox](/docs/components/native-checkbox), [Native Switch](/docs/components/native-switch), [Native Radio Group](/docs/components/native-radio-group), [Native Slider](/docs/components/native-slider) and [Native Select](/docs/components/native-select). For dates, colors, files and one-time codes, use [Input](/docs/components/input#input-types) with the native `type`.
