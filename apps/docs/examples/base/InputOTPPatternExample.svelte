<script lang="ts">
  import { REGEXP_ONLY_DIGITS } from '@sveltery/base/input-otp';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { InputOTP, InputOTPGroup, InputOTPSlot } from '$registry/bases/base/ui/input-otp';
</script>

<Field class="w-fit">
  <FieldLabel for="digits-only">Digits Only</FieldLabel>
  <InputOTP id="digits-only" maxlength={6} pattern={REGEXP_ONLY_DIGITS}>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
</Field>
