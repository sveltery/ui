<script lang="ts">
  import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from '$ui/field/index.js';
  import { Input } from '$ui/input/index.js';
  let { errors }: { errors?: Array<{ message?: string } | undefined> } = $props();
</script>
<FieldSet>
  <FieldLegend variant="label">Account</FieldLegend>
  <Field class="extra-field" data-invalid>
    <FieldLabel for="email">Email</FieldLabel>
    <Input id="email" type="email" aria-invalid />
    <FieldDescription>We send the receipt here.</FieldDescription>
    <FieldError {errors} data-testid="errors" />
    <FieldError data-testid="children">Enter an email.</FieldError>
  </Field>
  <Field orientation="horizontal" data-disabled>
    <FieldLabel for="name">Name</FieldLabel>
    <Input id="name" disabled />
  </Field>
</FieldSet>
