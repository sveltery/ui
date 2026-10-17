<script lang="ts">
  import SearchIcon from '@lucide/svelte/icons/search';
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '$registry/bases/base/ui/input-group';
</script>

<Field class="max-w-sm">
  <FieldLabel for="inline-start-input">Input</FieldLabel>
  <InputGroup>
    <InputGroupInput id="inline-start-input" placeholder="Search..." />
    <InputGroupAddon align="inline-start">
      <SearchIcon class="text-muted-foreground" />
    </InputGroupAddon>
  </InputGroup>
  <FieldDescription>Icon positioned at the start.</FieldDescription>
</Field>
