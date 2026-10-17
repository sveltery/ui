<script lang="ts">
  import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '$registry/bases/base/ui/field';
  import { Textarea } from '$registry/bases/base/ui/textarea';
</script>

<FieldSet class="w-full max-w-xs">
  <FieldGroup>
    <Field>
      <FieldLabel for="feedback">Feedback</FieldLabel>
      <Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
      <FieldDescription>Share your thoughts about our service.</FieldDescription>
    </Field>
  </FieldGroup>
</FieldSet>
