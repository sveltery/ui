<script lang="ts">
  import MinusIcon from '@lucide/svelte/icons/minus';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup } from '$registry/bases/base/ui/button-group';
</script>

<ButtonGroup orientation="vertical" aria-label="Media controls" class="h-fit">
  <Button variant="outline" size="icon">
    <PlusIcon />
  </Button>
  <Button variant="outline" size="icon">
    <MinusIcon />
  </Button>
</ButtonGroup>
