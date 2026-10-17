<script lang="ts">
  import { Badge } from '$registry/bases/base/ui/badge';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<Field>
  <FieldLabel for="input-badge">
    Webhook URL
    <Badge variant="secondary" class="ml-auto">Beta</Badge>
  </FieldLabel>
  <Input id="input-badge" type="url" placeholder="https://api.example.com/webhook" />
</Field>
