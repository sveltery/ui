<script lang="ts">
  import ShieldAlertIcon from '@lucide/svelte/icons/shield-alert';
  import { Button } from '$registry/bases/base/ui/button';
  import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';
</script>

<div class="flex w-full max-w-lg flex-col gap-6">
  <Item variant="outline">
    <ItemMedia variant="icon">
      <ShieldAlertIcon />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Security Alert</ItemTitle>
      <ItemDescription>New login detected from unknown device.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button size="sm" variant="outline">Review</Button>
    </ItemActions>
  </Item>
</div>
