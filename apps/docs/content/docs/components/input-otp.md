---
title: Input OTP
description: Accessible one-time password component with copy-paste functionality.
---

<ComponentPreview name="base/InputOTPDemoExample" />

## About

Input OTP is built on `@sveltery/input-otp`, a Svelte port of [input-otp](https://github.com/guilhermerodz/input-otp) by Guilherme Rodz. The port is released under the MIT License and has no runtime dependencies.

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add input-otp
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/input-otp
```

### Copy the component

Copy the following files into `src/lib/components/ui/input-otp`.

<ComponentSource name="input-otp" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '#lib/components/ui/input-otp';
</script>
```

```svelte
<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

`InputOTP` renders one transparent input over the slots. The input holds the code, takes the focus and the keyboard, and submits with its form. Each `InputOTPSlot` shows the character at its `index`, and marks the selected slot with `data-active="true"`.

## Composition

Use the following composition to build an `InputOTP`:

```text
InputOTP
├── InputOTPGroup
│   ├── InputOTPSlot
│   ├── InputOTPSlot
│   └── InputOTPSlot
├── InputOTPSeparator
├── InputOTPGroup
│   ├── InputOTPSlot
│   ├── InputOTPSlot
│   └── InputOTPSlot
├── InputOTPSeparator
└── InputOTPGroup
    ├── InputOTPSlot
    └── InputOTPSlot
```

## Pattern

Use the `pattern` prop to define a custom pattern for the OTP input. `@sveltery/input-otp` exports `REGEXP_ONLY_DIGITS`, `REGEXP_ONLY_CHARS` and `REGEXP_ONLY_DIGITS_AND_CHARS`. Input that doesn't match is dropped.

```svelte
<script lang="ts">
  import { REGEXP_ONLY_DIGITS_AND_CHARS } from '@sveltery/input-otp';
</script>

<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
  …
</InputOTP>
```

<ComponentPreview name="base/InputOTPPatternExample" />

## Separator

Use the `<InputOTPSeparator />` component to add a separator between input groups.

<ComponentPreview name="base/InputOTPSeparatorExample" />

## Disabled

Use the `disabled` prop to disable the input.

<ComponentPreview name="base/InputOTPDisabledExample" />

## Controlled

Use `bind:value` to control the input value. `onComplete` runs with the code when the last slot fills.

<ComponentPreview name="base/InputOTPControlledExample" />

## Invalid

Use `aria-invalid` on the slots to show an error state.

<ComponentPreview name="base/InputOTPInvalidExample" />

## Four Digits

A common pattern for PIN codes. This uses the `pattern={REGEXP_ONLY_DIGITS}` prop.

<ComponentPreview name="base/InputOTPFourDigitsExample" />

## Alphanumeric

Use `REGEXP_ONLY_DIGITS_AND_CHARS` to accept both letters and numbers.

<ComponentPreview name="base/InputOTPAlphanumericExample" />

## Form

<ComponentPreview name="base/InputOTPFormExample" class="*:data-[slot=preview]:h-[30rem]" />

Give `InputOTP` a `name` and it submits its value with its form. To label it, put it in a [Field](/docs/components/field) and pair the `FieldLabel` with the `InputOTP` `id`.

```svelte
<Field>
  <FieldLabel for="code">Verification code</FieldLabel>
  <InputOTP id="code" name="code" maxLength={6} required>
    …
  </InputOTP>
</Field>
```

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the field in a [DirectionProvider](/docs/components/direction) and set `dir` on the `Field` and the `InputOTP`. Use the language selector to switch the language.

<ComponentPreview name="base/InputOTPRtlExample" direction="rtl" align="start" />

## Without JavaScript

`InputOTP` renders a plain text input in a `<noscript>` fallback, so its form still submits before the page hydrates. For a code field with no slots at all, use [Input](/docs/components/input#one-time-codes) with `autocomplete="one-time-code"`.

## API Reference

See the [input-otp](https://input-otp.rodz.dev) documentation for more information.

`InputOTP` takes the props of `OTPInput` from `@sveltery/input-otp`. `class` goes to the input, and `containerClass` to the element that holds the slots. Other input attributes, such as `id`, `name`, `disabled` and `required`, go to the input.
