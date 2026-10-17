<script lang="ts">
  import SearchIcon from '@lucide/svelte/icons/search';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '$registry/bases/base/ui/input-group';
  import { Kbd } from '$registry/bases/base/ui/kbd';
</script>

<div class="flex w-full max-w-xs flex-col gap-6">
  <InputGroup>
    <InputGroupInput placeholder="Search..." />
    <InputGroupAddon>
      <SearchIcon />
    </InputGroupAddon>
    <InputGroupAddon align="inline-end">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </InputGroupAddon>
  </InputGroup>
</div>
