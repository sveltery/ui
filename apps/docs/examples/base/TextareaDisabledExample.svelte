<script lang="ts">
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { Textarea } from '$registry/bases/base/ui/textarea';
</script>

<Field data-disabled class="max-w-xs">
  <FieldLabel for="textarea-disabled">Message</FieldLabel>
  <Textarea id="textarea-disabled" placeholder="Type your message here." disabled />
</Field>
