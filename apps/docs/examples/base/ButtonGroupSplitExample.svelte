<script lang="ts">
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup, ButtonGroupSeparator } from '$registry/bases/base/ui/button-group';
</script>

<ButtonGroup>
  <Button variant="secondary">Button</Button>
  <ButtonGroupSeparator />
  <Button size="icon" variant="secondary">
    <PlusIcon />
  </Button>
</ButtonGroup>
