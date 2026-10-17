<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<Field>
  <FieldLabel for="input-field-username">Username</FieldLabel>
  <Input id="input-field-username" type="text" placeholder="Enter your username" />
  <FieldDescription>Choose a unique username for your account.</FieldDescription>
</Field>
