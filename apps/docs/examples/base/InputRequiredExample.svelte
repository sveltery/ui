<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<Field>
  <FieldLabel for="input-required">
    Required Field <span class="text-destructive">*</span>
  </FieldLabel>
  <Input id="input-required" placeholder="This field is required" required />
  <FieldDescription>This field must be filled out.</FieldDescription>
</Field>
