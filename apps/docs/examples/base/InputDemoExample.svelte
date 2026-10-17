<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<Field>
  <FieldLabel for="input-demo-api-key">API Key</FieldLabel>
  <Input id="input-demo-api-key" type="password" placeholder="sk-..." />
  <FieldDescription>Your API key is encrypted and stored securely.</FieldDescription>
</Field>
