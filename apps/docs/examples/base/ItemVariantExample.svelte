<script lang="ts">
  import InboxIcon from '@lucide/svelte/icons/inbox';
  import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';
</script>

<div class="flex w-full max-w-md flex-col gap-6">
  <Item>
    <ItemMedia variant="icon">
      <InboxIcon />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Default Variant</ItemTitle>
      <ItemDescription>Transparent background with no border.</ItemDescription>
    </ItemContent>
  </Item>
  <Item variant="outline">
    <ItemMedia variant="icon">
      <InboxIcon />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Outline Variant</ItemTitle>
      <ItemDescription>Outlined style with a visible border.</ItemDescription>
    </ItemContent>
  </Item>
  <Item variant="muted">
    <ItemMedia variant="icon">
      <InboxIcon />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Muted Variant</ItemTitle>
      <ItemDescription>Muted background for secondary content.</ItemDescription>
    </ItemContent>
  </Item>
</div>
