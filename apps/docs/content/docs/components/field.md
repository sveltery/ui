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
</script>
```

```svelte
<FieldSet>
  <FieldLegend>Profile</FieldLegend>
  <FieldDescription>This appears on invoices and emails.</FieldDescription>
  <FieldGroup>
    <Field name="name">
      <FieldLabel>Full name</FieldLabel>
      <Input autocomplete="off" placeholder="Evil Rabbit" />
      <FieldDescription>This appears on invoices and emails.</FieldDescription>
    </Field>
    <Field name="username">
      <FieldLabel>Username</FieldLabel>
      <Input autocomplete="off" required />
      <FieldError />
    </Field>
  </FieldGroup>
</FieldSet>
```

## Anatomy

`Field` is a Sveltery Base `Field.Root`. The control inside it, such as an [Input](/docs/components/input), is labelled by `FieldLabel` and described by `FieldDescription` and `FieldError`, so you do not pair `id` and `for` by hand.

- `FieldSet` and `FieldLegend` group related fields under one label. `FieldLegend` takes `variant="label"` for label-sized text.
- `FieldGroup` stacks fields, and `FieldSeparator` divides them.
- `FieldContent` groups a label and its description next to a control in a horizontal field.
- `FieldTitle` is a heading for a field that has no single control to label.

`orientation` on `Field` is `vertical` (the default), `horizontal` or `responsive`. A responsive field is vertical until its `FieldGroup` is wide enough.

## Validation and errors

`FieldError` shows the field's current message: the browser's message for a failed constraint, the result of `validate`, or an issue from a [form source](/docs/forms). It renders nothing while the field is valid. Pass children for a message of your own, and set `match` to a `ValidityState` flag to show it only for that constraint:

```svelte
<Field name="website">
  <FieldLabel>Website</FieldLabel>
  <Input type="url" required />
  <FieldError match="valueMissing">Enter a website.</FieldError>
  <FieldError match="typeMismatch">Enter a full URL, such as https://example.com.</FieldError>
</Field>
```

An invalid field sets `data-invalid` on the field and its parts, and `aria-invalid` on the control, which the styles read.

## Choice controls

A [Checkbox](/docs/components/checkbox), [Switch](/docs/components/switch) or [Slider](/docs/components/slider) inside a `Field` takes its name from the `FieldLabel`. In a [Radio Group](/docs/components/radio-group), wrap each option in `FieldItem`, so that each radio has its own label while the group stays one field:

```svelte
<Field name="plan">
  <FieldSet>
    <FieldLegend variant="label">Plan</FieldLegend>
    <RadioGroup defaultValue="starter">
      <FieldItem>
        <RadioGroupItem value="starter" />
        <FieldLabel>Starter</FieldLabel>
      </FieldItem>
      <FieldItem>
        <RadioGroupItem value="pro" />
        <FieldLabel>Pro</FieldLabel>
      </FieldItem>
    </RadioGroup>
  </FieldSet>
</Field>
```

## Forms

Give each `Field` a `name`, and it takes part in a [Form](/docs/forms). To bind a SvelteKit [remote form](/docs/forms/remote-forms) or [form action](/docs/forms/form-actions), pass its field to `field` instead.

## Differences from shadcn/ui

- `Field` wraps Sveltery Base Field, so labelling, descriptions and validation work without ids, and the field binds to a form source.
- `FieldError` has no `errors` prop. It reads the field's own errors, or renders its children.
- `FieldItem` is added for the options of a radio or checkbox group.
- `FieldLegend` renders a `<div>` labelled into its `FieldSet`, as Base does, and must sit inside a `FieldSet`.

## API reference

`Field` is styled on top of the Sveltery Base `Field` and `Fieldset` primitives, which own labelling, validation and form binding. See the [Base UI Field documentation](https://base-ui.com/react/components/field) for the behavior they port.
