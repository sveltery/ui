<script lang="ts">
  import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from '$ui/field/index.js';
  import { Form, FormError } from '$ui/form/index.js';
  import { Input } from '$ui/input/index.js';
  let { errors }: { errors?: Record<string, string | string[]> } = $props();
</script>
<Form {errors}>
  <FieldSet>
    <FieldLegend variant="label">Account</FieldLegend>
    <Field class="extra-field" name="email">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" />
      <FieldDescription>We send the receipt here.</FieldDescription>
      <FieldError data-testid="errors" />
    </Field>
    <Field orientation="horizontal" disabled>
      <FieldLabel>Name</FieldLabel>
      <Input />
    </Field>
    <Field invalid>
      <FieldLabel>Code</FieldLabel>
      <Input />
      <FieldError match data-testid="children">Enter a code.</FieldError>
    </Field>
  </FieldSet>
  <FormError data-testid="form-error" />
</Form>
