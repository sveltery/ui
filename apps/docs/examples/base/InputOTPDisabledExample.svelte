<script lang="ts">
  import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '$registry/bases/base/ui/input-otp';
</script>

<InputOTP id="disabled" maxlength={6} disabled value="123456">
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
