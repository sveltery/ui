# @sveltery/input-otp

A one-time password input for Svelte 5, ported from [input-otp](https://github.com/guilhermerodz/input-otp) 1.4.2. It renders one transparent input over slots you draw yourself, so the code types, pastes, autofills from a text message and submits like a single native input. It ships no styles.

The styled [Input OTP](https://ui.sveltery.dev/docs/components/input-otp) component in Sveltery UI is built on it.

## Install

```sh
npm install @sveltery/input-otp
```

## Usage

```svelte
<script lang="ts">
  import { OTPInput, REGEXP_ONLY_DIGITS } from '@sveltery/input-otp';

  let value = $state('');
</script>

<OTPInput maxLength={6} pattern={REGEXP_ONLY_DIGITS} bind:value onComplete={(code) => console.log(code)}>
  {#snippet children({ slots })}
    {#each slots as slot, index (index)}
      <div data-active={slot.isActive}>{slot.char ?? slot.placeholderChar}</div>
    {/each}
  {/snippet}
</OTPInput>
```

`children` receives the render props: `slots` (each with `char`, `placeholderChar`, `isActive` and `hasFakeCaret`), `isFocused` and `isHovering`. A component inside `OTPInput` reads the same object with `getOTPInputContext()`. Other input attributes, such as `id`, `name` and `disabled`, go to the input, and `containerClass` goes to the element that holds the slots.

Add the styled version to your app with `npx @sveltery/ui@latest add input-otp`.

## License

MIT. See `THIRD_PARTY_NOTICES.md` for the upstream license.
