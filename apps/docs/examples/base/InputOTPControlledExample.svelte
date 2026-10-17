<script lang="ts">
  import { InputOTP, InputOTPGroup, InputOTPSlot } from '$registry/bases/base/ui/input-otp';

  let value = $state('');
</script>

<div class="space-y-2">
  <InputOTP maxLength={6} bind:value>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
  <div class="text-center text-sm">
    {#if value === ''}
      Enter your one-time password.
    {:else}
      You entered: {value}
    {/if}
  </div>
</div>
