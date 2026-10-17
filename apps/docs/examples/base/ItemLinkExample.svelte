<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
  import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
  import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '$registry/bases/base/ui/item';
</script>

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

{#snippet externalLink(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" target="_blank" rel="noopener noreferrer" {...props}>{@render children?.()}</a>
{/snippet}

<div class="flex w-full max-w-md flex-col gap-4">
  <Item render={link}>
    <ItemContent>
      <ItemTitle>Visit our documentation</ItemTitle>
      <ItemDescription>Learn how to get started with our components.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <ChevronRightIcon class="size-4" />
    </ItemActions>
  </Item>
  <Item variant="outline" render={externalLink}>
    <ItemContent>
      <ItemTitle>External resource</ItemTitle>
      <ItemDescription>Opens in a new tab with security attributes.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <ExternalLinkIcon class="size-4" />
    </ItemActions>
  </Item>
</div>
