<script lang="ts">
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '$registry/bases/base/ui/input-otp';
  let value = $state<string>();
  let submitted = $state('');
</script>
<form onsubmit={(event) => { event.preventDefault(); submitted = JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))); }}>
  <Field>
    <FieldLabel for="code">Code</FieldLabel>
    <InputOTP id="code" name="code" length={6} defaultValue="12" bind:value>
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
  </Field>
  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</form>
<output data-testid="value">{value}</output>
<output data-testid="submitted">{submitted}</output>
