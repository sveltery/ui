---
title: Forms
description: Build forms with Field and Form, native validation, SvelteKit remote forms and form actions.
---

Forms build on [Field](/docs/components/field) and Form. Both keep shadcn/ui's markup and compose Sveltery Base underneath, which owns the form behavior. Each control inside a `Field` is labelled, described and validated through context, and `Form` collects the values, blocks a submit while a field is invalid, and focuses the first invalid field. Read the [Sveltery Base forms guide](https://github.com/sveltery/base/blob/main/apps/docs/content/handbook/forms.md) for the full model.

There is no form-state layer of its own. A form owns its state in one of these places:

- **The form itself.** `onFormSubmit` receives the value of each named field. This page shows it.
- **A SvelteKit remote form.** See [Remote forms](/docs/forms/remote-forms).
- **A SvelteKit form action.** See [Form actions](/docs/forms/form-actions).

<ComponentPreview name="forms/CompositeFieldsExample" />

## Usage

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Field, FieldError, FieldLabel } from '$lib/components/ui/field';
  import { Form } from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
</script>

<Form onFormSubmit={(values) => console.log(values)}>
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <Input type="email" required />
    <FieldError />
  </Field>
  <Button type="submit">Subscribe</Button>
</Form>
```

`Form` renders a native `<form>`, so `action` and `method` also submit the way HTML does.

## Validation

The controls take the native validation attributes: `required`, `pattern`, `minlength`, `maxlength`, `min`, `max` and `step`. Once the page hydrates, `Form` turns off the browser's validation bubbles and shows each message in `FieldError`.

For a rule of your own, pass `validate` to `Field`. It receives the value and returns a message, or `null` when the value is valid. `validationMode` on `Form` or `Field` sets when a field validates: `onSubmit` (the default), `onBlur` or `onChange`.

A bare `FieldError` shows the field's own error. Give it children or `errors` to show your own messages instead, as in shadcn/ui.

## Composite controls

[Checkbox](/docs/components/checkbox), [Switch](/docs/components/switch), [Radio Group](/docs/components/radio-group) and [Slider](/docs/components/slider) work inside a `Field` like an input. Each one submits through a hidden native input under the field's `name`, and takes its accessible name from the field's `FieldLabel`. For a radio group, wrap each option in `FieldItem`, so that each radio has its own label while the group stays one field.

## Errors from the server

Pass server errors to `errors` on `Form`, keyed by field name. A field shows its own error in `FieldError` until its value changes. `FormError` shows the messages that no field shows, such as an error for the whole form.

```svelte
<Form bind:errors onFormSubmit={save}>
  <FormError />
  …
</Form>
```
