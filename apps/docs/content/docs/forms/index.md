---
title: Forms
description: Build forms with Field, native validation, SvelteKit remote forms and form actions.
---

Forms build on [Field](/docs/components/field). Field only lays out a label, a control, a description and an error, as in shadcn/ui. The values and the validation belong to the form: a native `<form>`, a SvelteKit remote form, or a form action.

- **A native form.** Give each control a `name` and read the values from `FormData` on submit. This page shows it.
- **A SvelteKit remote form.** See [Remote forms](/docs/forms/remote-forms).
- **A SvelteKit form action.** See [Form actions](/docs/forms/form-actions).

<ComponentPreview name="forms/CompositeFieldsExample" />

## Usage

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Field, FieldError, FieldLabel } from '$lib/components/ui/field';
  import { Input } from '$lib/components/ui/input';

  let error = $state<string>();
</script>

<form onsubmit={save}>
  <Field data-invalid={!!error}>
    <FieldLabel for="email">Email</FieldLabel>
    <Input id="email" name="email" type="email" required aria-invalid={!!error} />
    <FieldError errors={[{ message: error }]} />
  </Field>
  <Button type="submit">Subscribe</Button>
</form>
```

## Validation

The controls take the native validation attributes: `required`, `pattern`, `minlength`, `maxlength`, `min`, `max` and `step`. The browser checks them before a submit.

To show a field as invalid, set `data-invalid` on `Field` and `aria-invalid` on its control. Pass the messages to `errors` on `FieldError`. It shows one message as text and several as a list, and renders nothing when there are none.

## Composite controls

[Checkbox](/docs/components/checkbox), [Switch](/docs/components/switch), [Radio Group](/docs/components/radio-group) and [Slider](/docs/components/slider) each submit through a hidden native input under their `name`. Give each one an `id` and point its `FieldLabel` at it with `for`. For the options of a radio group, wrap each option's `Field` in a `FieldLabel`, as above.
