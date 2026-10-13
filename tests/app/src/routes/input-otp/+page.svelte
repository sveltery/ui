<script lang="ts">
  import { Field, FieldLabel } from '@sveltery/ui/field';
  import { Form } from '@sveltery/ui/form';
  import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@sveltery/ui/input-otp';
  let value = $state<string>();
  let submitted = $state('');
</script>
<Form onFormSubmit={values => (submitted = JSON.stringify(values))}>
  <Field name="code">
    <FieldLabel>Code</FieldLabel>
    <InputOTP length={6} defaultValue="12" bind:value>
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
</Form>
<output data-testid="value">{value}</output>
<output data-testid="submitted">{submitted}</output>
