<script lang="ts">
  import SearchIcon from '@lucide/svelte/icons/search';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '$registry/bases/base/ui/empty';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '$registry/bases/base/ui/input-group';
  import { Kbd } from '$registry/bases/base/ui/kbd';
</script>

<Empty>
  <EmptyHeader>
    <EmptyTitle>404 - Not Found</EmptyTitle>
    <EmptyDescription>The page you're looking for doesn't exist. Try searching for what you need below.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <InputGroup class="sm:w-3/4">
      <InputGroupInput placeholder="Try searching for pages..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>/</Kbd>
      </InputGroupAddon>
    </InputGroup>
    <EmptyDescription>
      Need help?
      <!-- svelte-ignore a11y_invalid_attribute -->
      <a href="#">Contact support</a>
    </EmptyDescription>
  </EmptyContent>
</Empty>
