<script lang="ts">
  import { Field, FieldDescription, FieldError, FieldLabel } from '$ui/field/index.js';
  import { Form, FormError } from '$ui/form/index.js';
  import { Input } from '$ui/input/index.js';
  import { NativeSelect, NativeSelectOption } from '$ui/native-select/index.js';
  import { Textarea } from '$ui/textarea/index.js';
</script>
<Form errors={{ email: 'That email is taken.', bio: 'Write a little more.', plan: 'Pick a paid plan.', form: 'Signups are closed.' }}>
  <FormError />
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <Input type="email" />
    <FieldDescription>We send the receipt here.</FieldDescription>
    <FieldError />
  </Field>
  <Field name="bio">
    <FieldLabel>Bio</FieldLabel>
    <Textarea />
    <FieldError />
  </Field>
  <Field name="plan">
    <FieldLabel>Plan</FieldLabel>
    <NativeSelect>
      <NativeSelectOption value="free">Free</NativeSelectOption>
    </NativeSelect>
    <FieldError />
  </Field>
</Form>
