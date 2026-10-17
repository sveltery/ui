<script lang="ts">
  import SearchIcon from '@lucide/svelte/icons/search';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '$registry/bases/base/ui/input-group';
  import { Kbd } from '$registry/bases/base/ui/kbd';
</script>

<InputGroup class="max-w-sm">
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon>
    <SearchIcon class="text-muted-foreground" />
  </InputGroupAddon>
  <InputGroupAddon align="inline-end">
    <Kbd>⌘K</Kbd>
  </InputGroupAddon>
</InputGroup>
