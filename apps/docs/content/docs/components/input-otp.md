---
title: Input OTP
description: Accessible one-time password component with copy paste functionality.
---

<ComponentPreview name="base/InputOTPExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn github:sveltery/base
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
<InputOTP length={6}>
  <InputOTPGroup>
    <InputOTPSlot />
    <InputOTPSlot />
    <InputOTPSlot />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot />
    <InputOTPSlot />
    <InputOTPSlot />
  </InputOTPGroup>
</InputOTP>
```

Each `InputOTPSlot` is a real input, so there is no `input-otp` dependency. Slots take their position from their order, so they have no `index` prop. `length` sets the number of slots and must match the slots you render.

Typing moves to the next slot, Backspace moves back, and pasting a code fills every slot from the first. A phone that offers the code from a text message fills it too, through `autocomplete="one-time-code"`.

## Characters

`validationType` sets which characters a slot accepts: `numeric` (the default), `alpha`, `alphanumeric` or `none`. Characters that don't fit are dropped as the user types or pastes. `onValueInvalid` reports them.

## In a form

Put `InputOTP` in a [Field](/docs/components/field) to label it and submit its value under the field's `name`. A native reset restores `defaultValue`. `onValueComplete` runs when every slot is filled, and `autoSubmit` submits the form at that point.

```svelte
<Field name="code">
  <FieldLabel>Verification code</FieldLabel>
  <InputOTP length={6} required>
    …
  </InputOTP>
  <FieldError />
</Field>
```

## API reference

`InputOTP` is styled on top of the Sveltery Base `OTPField` primitive, which owns its behavior, focus handling and accessibility. See the [Base UI OTP Field documentation](https://base-ui.com/react/components/otp-field) for the behavior it ports.
