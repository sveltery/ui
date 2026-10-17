<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<Field>
  <FieldLabel for="picture">Picture</FieldLabel>
  <Input id="picture" type="file" />
  <FieldDescription>Select a picture to upload.</FieldDescription>
</Field>
