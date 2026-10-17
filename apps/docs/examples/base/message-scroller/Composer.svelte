<script lang="ts">
  import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
  import type { Snippet } from 'svelte';
  import { InputGroup, InputGroupAddon, InputGroupButton } from '$registry/bases/base/ui/input-group';
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
        <ArrowUpIcon />
        <span class="sr-only">Send</span>
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</form>
