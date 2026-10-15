---
title: Field
description: Combine labels, controls, and help text to compose accessible form fields and grouped inputs.
---

<ComponentPreview name="base/FieldExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx sveltery add field
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/field`.

<ComponentSource name="field" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

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

`Field` is a `<div role="group">`, `FieldLabel` is a `<label>`, and `FieldDescription` is a `<p>`. Each part renders through its Sveltery Base `Field` part, so inside a `Field` the label, the description and the error link to an [Input](/docs/components/input), [Textarea](/docs/components/textarea) or [Native Select](/docs/components/native-select) on their own. You can still pair a label with any control by hand: give the control an `id` and the label a matching `for`.

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

Inside a [Form](/docs/forms), `Field` validates its control and shows the error in a bare `FieldError`. Without one, you decide when a field is invalid and mark it:

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

`FieldError` is a `<div role="alert">`. It renders its children, or the messages in `errors`, an array of `{ message?: string }` objects. Several messages render as a list. With neither, it shows the field's own error, and renders nothing while the field is valid.

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

`name` on `Field` is what a form submits, and `field` binds a SvelteKit remote form field. See the [Forms](/docs/forms) guide for building forms with `Field` and `Form`.

## Differences from shadcn/ui

- The parts match shadcn/ui's Base UI variant, and compose Sveltery Base's `Field` and `Fieldset` parts underneath. `FieldLabel` takes the HTML `for` attribute in place of React's `htmlFor`.
- `FieldItem` wraps one option of a radio or checkbox group, so each option has its own label while the group stays one field.

## API reference

The `Field` parts take their Sveltery Base part's props and their element's attributes. `Field` takes Base `Field.Root`'s `name`, `field`, `type`, `validate`, `invalid` and `disabled`, and adds `orientation`. `FieldLegend` adds `variant`, and `FieldError` adds `errors`. The controls you put inside a field come from their own components, such as [Input](/docs/components/input) and [Select](/docs/components/select).
