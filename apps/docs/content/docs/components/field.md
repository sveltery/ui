---
title: Field
description: Combine labels, controls, and help text to compose accessible form fields and grouped inputs.
---

<ComponentPreview name="base/FieldExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/field`.

<ComponentSource name="field" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '$lib/components/ui/field';
  import { Input } from '$lib/components/ui/input';
  import { Switch } from '$lib/components/ui/switch';
</script>
```

```svelte
<FieldSet>
  <FieldLegend>Profile</FieldLegend>
  <FieldDescription>This appears on invoices and emails.</FieldDescription>
  <FieldGroup>
    <Field>
      <FieldLabel for="name">Full name</FieldLabel>
      <Input id="name" autocomplete="off" placeholder="Evil Rabbit" />
      <FieldDescription>This appears on invoices and emails.</FieldDescription>
    </Field>
    <Field>
      <FieldLabel for="username">Username</FieldLabel>
      <Input id="username" autocomplete="off" aria-invalid />
      <FieldError>Choose another username.</FieldError>
    </Field>
    <Field orientation="horizontal">
      <Switch id="newsletter" />
      <FieldLabel for="newsletter">Subscribe to the newsletter</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>
```

## Anatomy

The `Field` parts are plain elements. `Field` is a `<div role="group">`, `FieldLabel` is a `<label>`, and `FieldDescription` is a `<p>`. Pair each `FieldLabel` with its control by hand: give the control an `id` and the label a matching `for`.

```svelte
<Field>
  <FieldLabel for="input-id">Label</FieldLabel>
  <!-- Input, Select, Switch, etc. -->
  <FieldDescription>Optional helper text.</FieldDescription>
  <FieldError>Validation message.</FieldError>
</Field>
```

- `FieldSet` and `FieldLegend` render a `<fieldset>` and its `<legend>`, which group related fields under one label. `FieldLegend` takes `variant="label"` for label-sized text.
- `FieldGroup` stacks fields, and `FieldSeparator` divides them.
- `FieldContent` groups a label and its description next to a control in a horizontal field.
- `FieldTitle` is a heading for a field that has no single control to label.

`orientation` on `Field` is `vertical` (the default), `horizontal` or `responsive`. A responsive field is vertical until its `FieldGroup` is wide enough.

## Validation and errors

`Field` does not validate. You decide when a field is invalid and mark it:

- Set `data-invalid` on `Field` to switch the whole field into its error style.
- Set `aria-invalid` on the control so assistive technology announces it.
- Render `FieldError` right after the control, or inside `FieldContent`.

```svelte
<Field data-invalid>
  <FieldLabel for="email">Email</FieldLabel>
  <Input id="email" type="email" aria-invalid />
  <FieldError>Enter a valid email address.</FieldError>
</Field>
```

`FieldError` is a `<div role="alert">`. It renders its children, or the messages in `errors`, an array of `{ message?: string }` objects. Several messages render as a list. With no children and no message it renders nothing.

```svelte
<FieldError errors={[{ message: 'Enter a valid email address.' }]} />
```

A disabled field works the same way. Set `data-disabled` on `Field` and `disabled` on the control.

## Choice controls

For a [Checkbox](/docs/components/checkbox), [Switch](/docs/components/switch) or [Radio Group](/docs/components/radio-group) option, use a horizontal `Field` and pair the label with the control's `id`:

```svelte
<FieldSet>
  <FieldLegend variant="label">Plan</FieldLegend>
  <RadioGroup defaultValue="starter">
    <Field orientation="horizontal">
      <RadioGroupItem value="starter" id="plan-starter" />
      <FieldLabel for="plan-starter">Starter</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem value="pro" id="plan-pro" />
      <FieldLabel for="plan-pro">Pro</FieldLabel>
    </Field>
  </RadioGroup>
</FieldSet>
```

To make the whole option a selectable card, wrap the `Field` in a `FieldLabel`:

```svelte
<FieldLabel for="plan-pro">
  <Field orientation="horizontal">
    <RadioGroupItem value="pro" id="plan-pro" />
    <FieldContent>
      <FieldTitle>Pro</FieldTitle>
      <FieldDescription>For growing businesses.</FieldDescription>
    </FieldContent>
  </Field>
</FieldLabel>
```

## Forms

`Field` only lays out and styles a field. The control's own `name` is what a form submits. See the [Forms](/docs/forms) guide for building forms with `Field`.

## Differences from shadcn/ui

- The parts match shadcn/ui's Base UI variant. `FieldLabel` takes the HTML `for` attribute in place of React's `htmlFor`.

## API reference

The `Field` parts are styled HTML elements and take that element's attributes. `Field` adds `orientation`, `FieldLegend` adds `variant`, and `FieldError` adds `errors`. The controls you put inside a field come from their own components, such as [Input](/docs/components/input) and [Select](/docs/components/select).
