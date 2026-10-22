---
title: Form
description: A native form that validates its fields and shows their errors.
---

<ComponentPreview name="base/FormDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add form
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/form`.

<ComponentSource name="form" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Field, FieldError, FieldLabel } from '#lib/components/ui/field';
  import { Form, FormError } from '#lib/components/ui/form';
  import { Input } from '#lib/components/ui/input';
</script>
```

```svelte
<Form method="POST">
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <Input type="email" required />
    <FieldError />
  </Field>
  <FormError />
</Form>
```

`Form` is Sveltery Base's [Form](https://base.sveltery.dev/components/form). It renders a `<form>` and leaves the browser's constraint validation on, so an invalid form never submits, with or without JavaScript. With JavaScript, it cancels the browser's bubble for each control inside a [Field](/docs/components/field) and shows the message in that field's `FieldError` instead.

## Errors

Pass `errors` to show errors from a server or a validation library, keyed by field name. Each `Field` shows the entry under its `name`, and editing the field hides it. A message under the empty key `''` belongs to the whole form, and `FormError` shows it.

```svelte
<Form {errors} values={submitted}>
  <!-- Fields -->
  <FormError />
</Form>
```

`values` fills each control by name, so a form that comes back from the server keeps what the user typed.

## Remote forms

Pass a SvelteKit remote form as `form`. `Form` takes its `method`, `action` and submit handling, each `Field` reads its issues by its `name`, and `FormError` shows the issues that belong to no field. See [Remote forms](/docs/forms/remote-forms).

```svelte
<Form form={signup}>
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <Input {...signup.fields.email.as('email')} required />
    <FieldError />
  </Field>
  <FormError />
</Form>
```

## Submitting

`onsubmit` runs only after every constraint passes. Read the values with `FormData`:

```svelte
<Form
  onsubmit={(event) => {
    event.preventDefault();
    save(Object.fromEntries(new FormData(event.currentTarget)));
  }}
>
  <!-- Fields -->
</Form>
```

## API Reference

### Form

It takes every [Form](https://base.sveltery.dev/components/form) prop and every `<form>` attribute.

| Prop                     | Type                                       | Default      |
| ------------------------ | ------------------------------------------ | ------------ |
| `form`                   | a SvelteKit remote form                    |              |
| `errors`                 | `Record<string, string \| string[]>`        |              |
| `values`                 | `Record<string, unknown>`                  |              |
| `validationMode`         | `"onSubmit"` \| `"onBlur"` \| `"onChange"` | `"onSubmit"` |
| `validationDebounceTime` | `number`                                   | `0`          |
| `class`                  | `string`                                   |              |

### FormError

Shows the messages that belong to no field: a remote form's `invalid('message')`, or the `errors` entry under `''`. One message renders as text and several as a list. It renders nothing without messages.

| Prop       | Type                                         | Default |
| ---------- | -------------------------------------------- | ------- |
| `match`    | `boolean`                                    |         |
| `children` | `Snippet` \| `Snippet<[messages: string[]]>` |         |
| `class`    | `string`                                     |         |
