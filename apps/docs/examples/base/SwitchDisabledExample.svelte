<script lang="ts">
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { Switch } from '$registry/bases/base/ui/switch';
</script>

<Field orientation="horizontal" data-disabled class="w-fit">
  <Switch id="switch-disabled-unchecked" disabled />
  <FieldLabel for="switch-disabled-unchecked">Disabled</FieldLabel>
</Field>
