<script lang="ts">
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { Field, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
</script>

<FieldGroup class="mx-auto w-56">
  <Field orientation="horizontal" disabled>
    <Checkbox id="toggle-checkbox-disabled" name="toggle-checkbox-disabled" disabled />
    <FieldLabel for="toggle-checkbox-disabled">Enable notifications</FieldLabel>
  </Field>
</FieldGroup>
