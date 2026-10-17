<script lang="ts">
  import InfoIcon from '@lucide/svelte/icons/info';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '$registry/bases/base/ui/input-group';
</script>

<Field>
  <FieldLabel for="input-group-url">Website URL</FieldLabel>
  <InputGroup>
    <InputGroupInput id="input-group-url" placeholder="example.com" />
    <InputGroupAddon>
      <InputGroupText>https://</InputGroupText>
    </InputGroupAddon>
    <InputGroupAddon align="inline-end">
      <InfoIcon />
    </InputGroupAddon>
  </InputGroup>
</Field>
