<script lang="ts">
  import IconPlus from '@tabler/icons-svelte-runes/icons/plus';
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup, ButtonGroupSeparator } from '$registry/bases/base/ui/button-group';
</script>

<ButtonGroup>
  <Button variant="secondary">Button</Button>
  <ButtonGroupSeparator />
  <Button size="icon" variant="secondary">
    <IconPlus />
  </Button>
</ButtonGroup>
