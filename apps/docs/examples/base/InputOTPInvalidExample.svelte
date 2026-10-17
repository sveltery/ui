<script lang="ts">
  import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '$registry/bases/base/ui/input-otp';

  let value = $state('000000');
</script>

<InputOTP maxLength={6} bind:value>
  <InputOTPGroup>
    <InputOTPSlot index={0} aria-invalid />
    <InputOTPSlot index={1} aria-invalid />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={2} aria-invalid />
    <InputOTPSlot index={3} aria-invalid />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={4} aria-invalid />
    <InputOTPSlot index={5} aria-invalid />
  </InputOTPGroup>
</InputOTP>
