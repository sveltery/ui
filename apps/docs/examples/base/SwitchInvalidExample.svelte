<script lang="ts">
  import { Field, FieldContent, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Switch } from '$registry/bases/base/ui/switch';
</script>

<Field orientation="horizontal" class="max-w-sm" data-invalid>
  <FieldContent>
    <FieldLabel for="switch-terms">Accept terms and conditions</FieldLabel>
    <FieldDescription>You must accept the terms and conditions to continue.</FieldDescription>
  </FieldContent>
  <Switch id="switch-terms" aria-invalid />
</Field>
