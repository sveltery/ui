<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Textarea } from '$registry/bases/base/ui/textarea';
</script>

<Field invalid>
  <FieldLabel for="textarea-invalid">Message</FieldLabel>
  <Textarea id="textarea-invalid" placeholder="Type your message here." aria-invalid />
  <FieldDescription>Please enter a valid message.</FieldDescription>
</Field>
