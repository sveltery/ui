<script lang="ts">
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { Field, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
</script>

<FieldGroup class="mx-auto w-56">
  <Field orientation="horizontal" invalid>
    <Checkbox id="terms-checkbox-invalid" name="terms-checkbox-invalid" aria-invalid />
    <FieldLabel for="terms-checkbox-invalid">Accept terms and conditions</FieldLabel>
  </Field>
</FieldGroup>
