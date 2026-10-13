<script lang="ts">
  import type { Snippet } from 'svelte';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { InputGroup, InputGroupAddon, InputGroupButton } from '@sveltery/ui/input-group';
  import type { Chat } from './chat.svelte.js';

  let { chat, empty, children }: { chat: Chat; empty: string; children?: Snippet } = $props();
</script>

<form
  class="w-full"
  onsubmit={(event) => {
    event.preventDefault();
    chat.send();
  }}
>
  <InputGroup>
    <div class="h-14 w-full px-3 py-2.5">
      <span class="line-clamp-2 opacity-60 data-[status=ready]:opacity-100" data-status={chat.status}>
        {#if chat.next}
          {chat.next.text}
        {:else}
          <span class="text-muted-foreground">{empty}</span>
        {/if}
      </span>
    </div>
    <InputGroupAddon align="block-end" class="pt-1">
      {@render children?.()}
      <InputGroupButton type="submit" variant="default" size="icon-sm" disabled={!chat.next || chat.busy} class="ml-auto">
        <IconPlaceholder lucide="ArrowUpIcon" tabler="IconArrowUp" hugeicons="ArrowUp02Icon" phosphor="ArrowUpIcon" remixicon="RiArrowUpLine" />
        <span class="sr-only">Send</span>
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</form>
