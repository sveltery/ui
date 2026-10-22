---
title: Forms
description: Build forms with Field, native validation, SvelteKit remote forms and form actions.
---

Forms build on [Form](/docs/components/form) and [Field](/docs/components/field), which are Sveltery Base's `Form` and `Field.Root` under the shadcn/ui classes. `Field` ties its label, description and error to its control, and marks itself and the control invalid. `Form` keeps the browser's constraint validation on and shows its messages in each `FieldError` instead of the browser's bubble.

A form owns its values in one of these places:

- **The form itself.** A native `<form>` submits each named control. This page shows it.
- **A SvelteKit remote form.** See [Remote forms](/docs/forms/remote-forms).
- **A SvelteKit form action.** See [Form actions](/docs/forms/form-actions).

<ComponentPreview name="forms/CompositeFieldsExample" />

## Usage

```svelte
<script lang="ts">
  import { Button } from '#lib/components/ui/button';
  import { Field, FieldError, FieldLabel } from '#lib/components/ui/field';
  import { Form } from '#lib/components/ui/form';
  import { Input } from '#lib/components/ui/input';
</script>

<Form
  onsubmit={(event) => {
    event.preventDefault();
    console.log(Object.fromEntries(new FormData(event.currentTarget)));
  }}
>
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <Input type="email" required />
    <FieldError />
  </Field>
  <Button type="submit">Subscribe</Button>
</Form>
```

`Field` gives its `name` to the control, and `FieldLabel` labels the control without an `id`. `onsubmit` runs only when every constraint passes, so `FormData` holds valid values.

## Validation

The controls take the native validation attributes: `required`, `pattern`, `minlength`, `maxlength`, `min`, `max` and `step`. The browser checks them before a submit, and `FieldError` shows the browser's message. `validationMode` on `Form` or `Field` shows the messages on blur or on each change instead of on submit.

For a rule of your own, pass `validate` to `Field`. It returns a message, a list of messages or `null`. The message becomes the control's custom validity, so it blocks the submit like a native constraint:

```svelte
<Field name="password" validate={(value) => (String(value).length < 8 ? 'Use at least 8 characters.' : null)}>
  <FieldLabel>Password</FieldLabel>
  <Input type="password" />
  <FieldError />
</Field>
```

To show errors from a validation library or from your own state, pass them to `Form` as `errors`, keyed by field name. Each `FieldError` shows the entry under its `Field`'s `name`, and editing the field hides it. A message under the empty key `''` belongs to the whole form, and `FormError` shows it:

```svelte
<script lang="ts">
  import * as v from 'valibot';
  let errors = $state<Record<string, string[]>>({});

  function submit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const result = v.safeParse(schema, Object.fromEntries(new FormData(event.currentTarget)));
    errors = result.success ? {} : v.flatten<typeof schema>(result.issues).nested ?? {};
  }
</script>

<Form {errors} onsubmit={submit}>
  <!-- Fields -->
  <FormError />
</Form>
```

To mark a field invalid by hand, set `invalid` on `Field`. A `FieldError` with `match` always shows its children:

```svelte
<Field orientation="horizontal" invalid={termsInvalid}>
  <Checkbox id="terms" name="terms" />
  <FieldLabel for="terms">Accept the terms</FieldLabel>
  {#if termsInvalid}
    <FieldError match>Accept the terms to continue.</FieldError>
  {/if}
</Field>
```

## Composite controls

[Checkbox](/docs/components/checkbox), [Switch](/docs/components/switch), [Radio Group](/docs/components/radio-group) and [Slider](/docs/components/slider) each submit through a hidden native input under their `name`. Give the control an `id` and its `FieldLabel` a matching `for`. For a radio group, put `name` on `RadioGroup`, and give each option its own horizontal `Field` and label.

## Without JavaScript

The composite controls need JavaScript for the keyboard and for a remote form's `as()` spread. For a form that must work before the page hydrates, use their native twins, which look the same: [Native Checkbox](/docs/components/native-checkbox), [Native Switch](/docs/components/native-switch), [Native Radio Group](/docs/components/native-radio-group), [Native Slider](/docs/components/native-slider) and [Native Select](/docs/components/native-select). For dates, colors, files and one-time codes, use [Input](/docs/components/input#input-types) with the native `type`.
