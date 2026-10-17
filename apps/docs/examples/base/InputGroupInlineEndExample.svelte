<script lang="ts">
  import EyeOffIcon from '@lucide/svelte/icons/eye-off';
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '$registry/bases/base/ui/input-group';
</script>

<Field class="max-w-sm">
  <FieldLabel for="inline-end-input">Input</FieldLabel>
  <InputGroup>
    <InputGroupInput id="inline-end-input" type="password" placeholder="Enter password" />
    <InputGroupAddon align="inline-end">
      <EyeOffIcon />
    </InputGroupAddon>
  </InputGroup>
  <FieldDescription>Icon positioned at the end.</FieldDescription>
</Field>
