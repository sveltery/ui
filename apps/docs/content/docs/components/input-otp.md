---
title: Input OTP
description: Accessible one-time password component with copy paste functionality.
---

<ComponentPreview name="base/InputOTPExample" />

## About

Input OTP is built on `@sveltery/input-otp`, a Svelte port of [input-otp](https://github.com/guilhermerodz/input-otp) by Guilherme Rodz. The port is released under the MIT License and has no runtime dependencies.

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/input-otp
```

### Copy the component

Copy the following files into `src/lib/components/ui/input-otp`.

<ComponentSource name="input-otp" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '$lib/components/ui/input-otp';
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

```text
InputOTP
├── InputOTPGroup
│   ├── InputOTPSlot
│   ├── InputOTPSlot
│   └── InputOTPSlot
├── InputOTPSeparator
└── InputOTPGroup
    ├── InputOTPSlot
    ├── InputOTPSlot
    └── InputOTPSlot
```

## Pattern

Use the `pattern` prop to set the characters the input accepts. Input that doesn't match is dropped.

```svelte
<script lang="ts">
  import { REGEXP_ONLY_DIGITS_AND_CHARS } from '@sveltery/input-otp';
</script>

<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
  …
</InputOTP>
```

`@sveltery/input-otp` also exports `REGEXP_ONLY_DIGITS` and `REGEXP_ONLY_CHARS`.

## Value

Use `bind:value` to read or set the code. `onComplete` runs with the code when the last slot fills.

```svelte
<script lang="ts">
  let value = $state('');
</script>

<InputOTP maxLength={6} bind:value onComplete={(code) => console.log(code)}>
  …
</InputOTP>
```

## In a form

Give `InputOTP` a `name` and it submits its value with its form. To label it, put it in a [Field](/docs/components/field) and pair the `FieldLabel` with the `InputOTP` `id`.

```svelte
<Field>
  <FieldLabel for="code">Verification code</FieldLabel>
  <InputOTP id="code" name="code" maxLength={6} required>
    …
  </InputOTP>
</Field>
```

## Invalid

Use `aria-invalid` on the slots to show an error state.

## API reference

`InputOTP` takes the props of `OTPInput` from `@sveltery/input-otp`, which follow [input-otp](https://input-otp.rodz.dev). `class` goes to the input, and `containerClass` to the element that holds the slots. Other input attributes, such as `id`, `name`, `disabled` and `required`, go to the input.
