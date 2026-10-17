<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup } from '$registry/bases/base/ui/button-group';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<Field>
  <FieldLabel for="input-button-group">Search</FieldLabel>
  <ButtonGroup>
    <Input id="input-button-group" placeholder="Type to search..." />
    <Button variant="outline">Search</Button>
  </ButtonGroup>
</Field>
