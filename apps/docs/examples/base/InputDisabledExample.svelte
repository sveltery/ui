<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<Field disabled>
  <FieldLabel for="input-demo-disabled">Email</FieldLabel>
  <Input id="input-demo-disabled" type="email" placeholder="Email" disabled />
  <FieldDescription>This field is currently disabled.</FieldDescription>
</Field>
