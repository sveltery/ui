---
title: Input
description: A text input component for forms and user data entry with built-in styling and accessibility features.
---

<ComponentPreview name="base/InputExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add input
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/input`.

<ComponentSource name="input" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Input } from '#lib/components/ui/input';
  let email = $state('');
</script>
```

```svelte
<Input type="email" name="email" placeholder="Email" bind:value={email} />
```

## Forms

`Input` renders a real `<input>`, so it submits its `name` and value with the form. Use `bind:value` to share the value, or `defaultValue` to give an unbound input its starting value.

```svelte
<form method="POST">
  <Input name="email" type="email" defaultValue="me@example.com" />
  <button type="submit">Save</button>
</form>
```

## Input types

`Input` takes every native `type`. The browser draws the pickers for `date`, `time`, `datetime-local`, `month`, `week`, `color` and `file`, so they work without JavaScript and need no extra component.

```svelte
<Input type="date" name="birthday" />
<Input type="color" name="accent" class="w-16 p-1" />
<Input type="file" name="avatar" accept="image/*" />
```

A form with a file input needs `enctype="multipart/form-data"`.

## One-time codes

For a one-time code, `inputmode="numeric"` brings up the number keyboard, and `autocomplete="one-time-code"` lets the phone fill the code from a message.

```svelte
<Input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength={6} pattern={'\\d{6}'} />
```

[Input OTP](/docs/components/input-otp) shows one slot per character instead.

## Remote forms

Spread a [remote form](/docs/forms/remote-forms) field onto `Input` with `as()` and the input type, such as `as('date')`, `as('color')` or `as('file')`. Kit does not add the multipart encoding for a file field, so set `enctype` on the form yourself.

<ComponentPreview name="forms/InputTypesRemoteExample" />

```svelte
<form {...f} enctype="multipart/form-data">
  <Field>
    <FieldLabel for="birthday">Birthday</FieldLabel>
    <Input id="birthday" {...f.fields.birthday.as('date')} required />
  </Field>
  <Field>
    <FieldLabel for="accent">Accent color</FieldLabel>
    <Input id="accent" {...f.fields.accent.as('color')} class="w-16 p-1" />
  </Field>
  <Field>
    <FieldLabel for="avatar">Avatar</FieldLabel>
    <Input id="avatar" {...f.fields.avatar.as('file')} accept="image/*" />
  </Field>
  <Field>
    <FieldLabel for="code">Verification code</FieldLabel>
    <Input id="code" {...f.fields.code.as('text')} inputmode="numeric" autocomplete="one-time-code" maxlength={6} />
  </Field>
  <Button type="submit">Save profile</Button>
</form>
```

## API reference

`Input` is styled on top of the Sveltery Base `Input` primitive, which owns its behavior and its integration with Base fields and forms. See the [Base UI Input documentation](https://base-ui.com/react/components/input) for the behavior it ports.
