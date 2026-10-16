---
title: Input OTP
description: Accessible one-time password component with copy paste functionality.
---

<ComponentPreview name="base/InputOTPExample" />

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
npm install cn @sveltery/base @lucide/svelte
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

Give `InputOTP` a `name` and it submits its value with its form. A native reset restores `defaultValue`. `onValueComplete` runs when every slot is filled, and `autoSubmit` submits the form at that point. To label it, put it in a [Field](/docs/components/field) and pair the `FieldLabel` with the `InputOTP` `id`.

```svelte
<Field>
  <FieldLabel for="code">Verification code</FieldLabel>
  <InputOTP id="code" name="code" length={6} required>
    …
  </InputOTP>
</Field>
```

## API reference

`InputOTP` is styled on top of the Sveltery Base `OTPField` primitive, which owns its behavior, focus handling and accessibility. See the [Base UI OTP Field documentation](https://base-ui.com/react/components/otp-field) for the behavior it ports.
