<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
  import { Button } from '$registry/bases/base/ui/button';
  import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';
</script>

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<div class="flex w-full max-w-md flex-col gap-6">
  <Item variant="outline">
    <ItemContent>
      <ItemTitle>Basic Item</ItemTitle>
      <ItemDescription>A simple item with title and description.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button variant="outline" size="sm">Action</Button>
    </ItemActions>
  </Item>
  <Item variant="outline" size="sm" render={link}>
    <ItemMedia>
      <BadgeCheckIcon class="size-5" />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Your profile has been verified.</ItemTitle>
    </ItemContent>
    <ItemActions>
      <ChevronRightIcon class="size-4" />
    </ItemActions>
  </Item>
</div>
