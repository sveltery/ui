---
title: Field
description: Combine labels, controls, and help text to compose accessible form fields and grouped inputs.
---

<ComponentPreview name="base/FieldDemoExample" class="[&_[data-slot=preview]]:max-h-none" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add field
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
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
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '#lib/components/ui/field';
  import { Input } from '#lib/components/ui/input';
  import { Switch } from '#lib/components/ui/switch';
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
    <Field invalid>
      <FieldLabel for="username">Username</FieldLabel>
      <Input id="username" autocomplete="off" />
      <FieldError match>Choose another username.</FieldError>
    </Field>
    <Field orientation="horizontal">
      <Switch id="newsletter" />
      <FieldLabel for="newsletter">Subscribe to the newsletter</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>
```

## Composition

### Field

A single control with label, helper text, and validation.

```text
Field
├── FieldLabel
├── Input / Textarea / Switch / Select
├── FieldDescription
└── FieldError
```

### FieldGroup

Related fields in one group. Use `FieldSeparator` between sections when needed.

```text
FieldGroup
├── Field
│   ├── FieldLabel
│   ├── Input / Textarea / Switch / Select
│   ├── FieldDescription
│   └── FieldError
├── FieldSeparator
└── Field
    ├── FieldLabel
    └── Input / Textarea / Switch / Select
```

### FieldSet

Semantic grouping with a legend and description, usually containing a `FieldGroup`.

```text
FieldSet
├── FieldLegend
├── FieldDescription
└── FieldGroup
    ├── Field
    │   ├── FieldLabel
    │   ├── Input / Textarea / Switch / Select
    │   ├── FieldDescription
    │   └── FieldError
    └── Field
        ├── FieldLabel
        └── Input / Textarea / Switch / Select
```

## Anatomy

The `Field` family is designed for composing accessible forms. A typical field is structured as follows:

```svelte
<Field name="email">
  <FieldLabel>Label</FieldLabel>
  <!-- Input, Select, Switch, etc. -->
  <FieldDescription>Optional helper text.</FieldDescription>
  <FieldError />
</Field>
```

- `Field` is the core wrapper for a single field. It is Sveltery Base's [Field.Root](https://base.sveltery.dev/components/field): it labels and describes its control, tracks its validity, and marks every part with the field's state.
- `FieldContent` is a flex column that groups label and description. Not required if you have no description.
- Wrap related fields with `FieldGroup`, and use `FieldSet` with `FieldLegend` for semantic grouping.

## Form

Put the fields in a [Form](/docs/components/form) and give each `Field` a `name`. In a plain form, the control submits under that name, and `FieldError` shows the `errors` entry under it. In a [SvelteKit remote form](/docs/forms/remote-forms), the name is the field's path, and `FieldError` shows its issues. See the [Forms](/docs/forms) documentation for plain forms, remote forms and [form actions](/docs/forms/form-actions).

## Input

<ComponentPreview name="base/FieldInputExample" />

## Textarea

<ComponentPreview name="base/FieldTextareaExample" />

## Select

<ComponentPreview name="base/FieldSelectExample" />

## Slider

<ComponentPreview name="base/FieldSliderExample" />

## Fieldset

<ComponentPreview name="base/FieldFieldsetExample" />

## Checkbox

<ComponentPreview name="base/FieldCheckboxExample" />

## Radio

<ComponentPreview name="base/FieldRadioExample" />

## Switch

<ComponentPreview name="base/FieldSwitchExample" />

## Choice Card

Wrap `Field` components inside `FieldLabel` to create selectable field groups. This works with `RadioGroupItem`, `Checkbox` and `Switch` components.

<ComponentPreview name="base/FieldChoiceCardExample" />

## Field Group

Stack `Field` components with `FieldGroup`. Add `FieldSeparator` to divide them.

<ComponentPreview name="base/FieldGroupExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the form in a [DirectionProvider](/docs/components/direction) and set `dir` on the container. Use the language selector to switch the language.

<ComponentPreview name="base/FieldRtlExample" direction="rtl" align="start" class="[&_[data-slot=preview]]:max-h-none" />

## Responsive Layout

- **Vertical fields:** Default orientation stacks label, control, and helper text, ideal for mobile-first layouts.
- **Horizontal fields:** Set `orientation="horizontal"` on `Field` to align the label and control side-by-side. Pair with `FieldContent` to keep descriptions aligned.
- **Responsive fields:** Set `orientation="responsive"` for automatic column layouts inside container-aware parents. Apply `@container/field-group` classes on `FieldGroup` to switch orientations at specific breakpoints.

<ComponentPreview name="base/FieldResponsiveExample" />

## Validation and Errors

- `Field` marks itself and its parts with `data-invalid` when its control fails a native constraint or its `validate` check, when its `Form` has errors or issues for its `name`, or when you set `invalid`. The control gets `aria-invalid`.
- `FieldError` shows the field's messages and renders nothing while the field is valid. With `match`, it always renders its children. Set `match` to a [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) key, such as `"valueMissing"`, to show a message for one constraint only.
- Render `FieldError` immediately after the control or inside `FieldContent` to keep error messages aligned with the field.

```svelte
<Field name="email">
  <FieldLabel>Email</FieldLabel>
  <Input type="email" required />
  <FieldError match="valueMissing">Enter your email address.</FieldError>
  <FieldError match="typeMismatch">Enter a valid email address.</FieldError>
</Field>
```

Set `disabled` on `Field` to disable its control. `Field` and its parts get `data-disabled`.

## Accessibility

- `FieldSet` and `FieldLegend` keep related controls grouped for keyboard and assistive tech users.
- `Field` outputs `role="group"` so nested controls inherit labeling from `FieldLabel` and `FieldLegend` when combined.
- `FieldLabel` labels the control and `FieldDescription` and `FieldError` describe it through `aria-describedby`, with ids that are in the server HTML.
- Apply `FieldSeparator` sparingly to ensure screen readers encounter clear section boundaries.

## API Reference

### FieldSet

Container that renders a semantic `fieldset` with spacing presets. It is Base's [Fieldset.Root](https://base.sveltery.dev/components/fieldset).

| Prop       | Type      | Default |
| ---------- | --------- | ------- |
| `disabled` | `boolean` | `false` |
| `class`    | `string`  |         |

```svelte
<FieldSet>
  <FieldLegend>Delivery</FieldLegend>
  <FieldGroup><!-- Fields --></FieldGroup>
</FieldSet>
```

### FieldLegend

Legend for a `FieldSet`, from Base's `Fieldset.Legend`. It renders a `div` that names the fieldset through `aria-labelledby`. Switch to the `label` variant to align with label sizing.

| Prop      | Type                  | Default    |
| --------- | --------------------- | ---------- |
| `variant` | `"legend"` \| `"label"` | `"legend"` |
| `class`   | `string`              |            |

```svelte
<FieldLegend variant="label">Notification Preferences</FieldLegend>
```

The `FieldLegend` has two variants: `legend` and `label`. The `label` variant applies label sizing and alignment. Handy if you have nested `FieldSet`.

### FieldGroup

Layout wrapper that stacks `Field` components and enables container queries for responsive orientations.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<FieldGroup class="@container/field-group flex flex-col gap-6">
  <Field><!-- ... --></Field>
  <Field><!-- ... --></Field>
</FieldGroup>
```

### Field

The core wrapper for a single field. Provides orientation control, invalid state styling, and spacing. It takes every [Field.Root](https://base.sveltery.dev/components/field) prop.

| Prop                     | Type                                             | Default      |
| ------------------------ | ------------------------------------------------ | ------------ |
| `name`                   | `string`                                         |              |
| `orientation`            | `"vertical"` \| `"horizontal"` \| `"responsive"` | `"vertical"` |
| `invalid`                | `boolean`                                        |              |
| `disabled`               | `boolean`                                        | `false`      |
| `validate`               | `(value: unknown) => string \| string[] \| null` |              |
| `validationMode`         | `"onSubmit"` \| `"onBlur"` \| `"onChange"`       |              |
| `validationDebounceTime` | `number`                                         | `0`          |
| `class`                  | `string`                                         |              |

`Field` and its parts carry `data-invalid`, `data-valid`, `data-disabled`, `data-touched`, `data-dirty`, `data-filled` and `data-focused` while each state holds.

```svelte
<Field orientation="horizontal">
  <FieldLabel for="remember">Remember me</FieldLabel>
  <Switch id="remember" />
</Field>
```

### FieldContent

Flex column that groups control and descriptions when the label sits beside the control. Not required if you have no description.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<Field>
  <Checkbox id="notifications" />
  <FieldContent>
    <FieldLabel for="notifications">Notifications</FieldLabel>
    <FieldDescription>Email, SMS, and push options.</FieldDescription>
  </FieldContent>
</Field>
```

### FieldItem

One option of a checkbox or radio group inside a named `Field`, from Base's [Field.Item](https://base.sveltery.dev/components/field). It lays out like a horizontal `Field`, and gives its `FieldLabel` and `FieldDescription` to its own control.

| Prop          | Type                                             | Default        |
| ------------- | ------------------------------------------------ | -------------- |
| `orientation` | `"vertical"` \| `"horizontal"` \| `"responsive"` | `"horizontal"` |
| `disabled`    | `boolean`                                        | `false`        |
| `class`       | `string`                                         |                |

```svelte
<Field name="plan">
  <FieldSet>
    <FieldLegend>Plan</FieldLegend>
    <FieldItem>
      <NativeRadio id="plan-pro" name="plan" value="pro" />
      <FieldLabel for="plan-pro">Pro</FieldLabel>
    </FieldItem>
  </FieldSet>
  <FieldError />
</Field>
```

### FieldLabel

Label styled for both direct inputs and nested `Field` children. It is Base's [Field.Label](https://base.sveltery.dev/components/field), so inside a `Field` it labels the control without `for` and `id`.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<FieldLabel for="email">Email</FieldLabel>
```

### FieldTitle

Renders a title with label styling inside `FieldContent`.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<FieldContent>
  <FieldTitle>Enable Touch ID</FieldTitle>
  <FieldDescription>Unlock your device faster.</FieldDescription>
</FieldContent>
```

### FieldDescription

Helper text slot that automatically balances long lines in horizontal layouts. It is Base's `Field.Description`, so the control lists it in `aria-describedby`.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<FieldDescription>We never share your email with anyone.</FieldDescription>
```

### FieldSeparator

Visual divider to separate sections inside a `FieldGroup`. Accepts optional inline content.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<FieldSeparator>Or continue with</FieldSeparator>
```

### FieldError

Accessible error container for the field's messages, from Base's [Field.Error](https://base.sveltery.dev/components/field). It shows the browser's constraint message, the `validate` message, and the `Form` `errors` or remote form issues for the field's `name`. One message renders as text and several as a list. It renders nothing while the field is valid.

| Prop       | Type                                       | Default |
| ---------- | ------------------------------------------ | ------- |
| `match`    | `boolean` \| `keyof ValidityState`         |         |
| `children` | `Snippet` \| `Snippet<[messages: string[]]>` |         |
| `class`    | `string`                                   |         |

```svelte
<FieldError />
<FieldError match="valueMissing">Enter your email address.</FieldError>
<FieldError>
  {#snippet children(messages)}{messages.join(' ')}{/snippet}
</FieldError>
```

To show errors from a validation library, such as issues from a [Standard Schema](https://standardschema.dev/) result, pass them to [Form](/docs/components/form) as `errors`, keyed by field name. See [Validation](/docs/forms#validation).
