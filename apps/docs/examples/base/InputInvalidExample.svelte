<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<Field data-invalid>
  <FieldLabel for="input-invalid">Invalid Input</FieldLabel>
  <Input id="input-invalid" placeholder="Error" aria-invalid />
  <FieldDescription>This field contains validation errors.</FieldDescription>
</Field>
