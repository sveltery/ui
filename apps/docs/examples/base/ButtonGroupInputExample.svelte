<script lang="ts">
  import SearchIcon from '@lucide/svelte/icons/search';
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup } from '$registry/bases/base/ui/button-group';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<ButtonGroup>
  <Input placeholder="Search..." />
  <Button variant="outline" aria-label="Search">
    <SearchIcon />
  </Button>
</ButtonGroup>
