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
<Field>
  <FieldLabel for="input-id">Label</FieldLabel>
  <!-- Input, Select, Switch, etc. -->
  <FieldDescription>Optional helper text.</FieldDescription>
  <FieldError>Validation message.</FieldError>
</Field>
```

- `Field` is the core wrapper for a single field.
- `FieldContent` is a flex column that groups label and description. Not required if you have no description.
- Wrap related fields with `FieldGroup`, and use `FieldSet` with `FieldLegend` for semantic grouping.

## Form

`Field` holds no form state. Put `name` on each control, and mark errors as in [Validation and Errors](#validation-and-errors). See the [Forms](/docs/forms) documentation for building forms with the `Field` component and [SvelteKit remote forms](/docs/forms/remote-forms) or [form actions](/docs/forms/form-actions).

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

Wrap the form in a [DirectionProvider](/docs/components/direction) and set `dir` on the container. Use the language selector to switch the language.

<ComponentPreview name="base/FieldRtlExample" direction="rtl" align="start" class="[&_[data-slot=preview]]:max-h-none" />

## Responsive Layout

- **Vertical fields:** Default orientation stacks label, control, and helper text, ideal for mobile-first layouts.
- **Horizontal fields:** Set `orientation="horizontal"` on `Field` to align the label and control side-by-side. Pair with `FieldContent` to keep descriptions aligned.
- **Responsive fields:** Set `orientation="responsive"` for automatic column layouts inside container-aware parents. Apply `@container/field-group` classes on `FieldGroup` to switch orientations at specific breakpoints.

<ComponentPreview name="base/FieldResponsiveExample" />

## Validation and Errors

- Add `data-invalid` to `Field` to switch the entire block into an error state.
- Add `aria-invalid` on the input itself for assistive technologies.
- Render `FieldError` immediately after the control or inside `FieldContent` to keep error messages aligned with the field.

```svelte
<Field data-invalid>
  <FieldLabel for="email">Email</FieldLabel>
  <Input id="email" type="email" aria-invalid />
  <FieldError>Enter a valid email address.</FieldError>
</Field>
```

A disabled field works the same way. Set `data-disabled` on `Field` and `disabled` on the control.

## Accessibility

- `FieldSet` and `FieldLegend` keep related controls grouped for keyboard and assistive tech users.
- `Field` outputs `role="group"` so nested controls inherit labeling from `FieldLabel` and `FieldLegend` when combined.
- Apply `FieldSeparator` sparingly to ensure screen readers encounter clear section boundaries.

## Differences from shadcn/ui

- `FieldLabel` takes the HTML `for` attribute in place of React's `htmlFor`.

## API Reference

### FieldSet

Container that renders a semantic `fieldset` with spacing presets.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<FieldSet>
  <FieldLegend>Delivery</FieldLegend>
  <FieldGroup><!-- Fields --></FieldGroup>
</FieldSet>
```

### FieldLegend

Legend element for a `FieldSet`. Switch to the `label` variant to align with label sizing.

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

The core wrapper for a single field. Provides orientation control, invalid state styling, and spacing.

| Prop           | Type                                         | Default      |
| -------------- | -------------------------------------------- | ------------ |
| `orientation`  | `"vertical"` \| `"horizontal"` \| `"responsive"` | `"vertical"` |
| `class`        | `string`                                     |              |
| `data-invalid` | `boolean`                                    |              |

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

### FieldLabel

Label styled for both direct inputs and nested `Field` children.

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

Helper text slot that automatically balances long lines in horizontal layouts.

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

Accessible error container that accepts children or an `errors` array (for example, from a form library or a remote form's `issues()`).

| Prop     | Type                                       | Default |
| -------- | ------------------------------------------ | ------- |
| `errors` | `Array<{ message?: string }>`                     |         |
| `class`  | `string`                                   |         |

```svelte
<FieldError errors={[{ message: 'Choose another username.' }]} />
```

When the `errors` array contains multiple messages, the component renders a list automatically. With neither children nor `errors`, it renders nothing.

`FieldError` also accepts issues produced by any validator that implements [Standard Schema](https://standardschema.dev/), including Zod, Valibot, and ArkType. Pass the `issues` array from the schema result directly to render a unified error list across libraries.
