<script lang="ts">
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { Switch } from '$registry/bases/base/ui/switch';
</script>

<Field orientation="horizontal" class="w-fit">
  <FieldLabel for="2fa">Multi-factor authentication</FieldLabel>
  <Switch id="2fa" />
</Field>
