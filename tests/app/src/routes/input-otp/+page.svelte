<script lang="ts">
  import { REGEXP_ONLY_DIGITS } from '@sveltery/input-otp';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '$registry/bases/base/ui/input-otp';
  let value = $state<string>();
  let submitted = $state('');
  let completed = $state<string[]>([]);
</script>
<form onsubmit={(event) => { event.preventDefault(); submitted = JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))); }}>
  <Field>
    <FieldLabel for="code">Code</FieldLabel>
    <InputOTP id="code" name="code" maxLength={6} pattern={REGEXP_ONLY_DIGITS} defaultValue="12" bind:value onComplete={(code) => (completed = [...completed, code])}>
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
  </Field>
  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</form>
<Field>
  <FieldLabel for="disabled">Disabled</FieldLabel>
  <InputOTP id="disabled" maxLength={4} disabled value="1234">
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
    </InputOTPGroup>
  </InputOTP>
</Field>
<output data-testid="value">{value}</output>
<output data-testid="submitted">{submitted}</output>
<output data-testid="completed">{completed.join(',')}</output>
