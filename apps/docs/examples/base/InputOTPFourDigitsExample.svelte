<script lang="ts">
  import { REGEXP_ONLY_DIGITS } from '@sveltery/base/input-otp';
  import { InputOTP, InputOTPGroup, InputOTPSlot } from '$registry/bases/base/ui/input-otp';
</script>

<InputOTP maxlength={4} pattern={REGEXP_ONLY_DIGITS}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
  </InputOTPGroup>
</InputOTP>
