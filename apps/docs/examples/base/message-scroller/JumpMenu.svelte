<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { useMessageScroller } from '$registry/bases/base/ui/message-scroller';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';
  import type { ChatMessage } from './chat.svelte.js';

  let { messages }: { messages: ChatMessage[] } = $props();
  const scroller = useMessageScroller();
  const trim = (text: string) => (text.length > 42 ? `${text.slice(0, 39)}...` : text);
</script>

<Popover>
  <PopoverTrigger>
    {#snippet render(props, _state, content)}<Button variant="secondary" {...props}>{@render content?.()}</Button>{/snippet}
    Jump to...
  </PopoverTrigger>
  <PopoverContent align="end" class="flex w-64 flex-col gap-1 p-1">
    <span class="px-2 py-1.5 text-xs text-muted-foreground">Conversations</span>
    {#each messages as message (message.id)}
      <button
        type="button"
        class="flex min-h-7 items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
        onclick={() => scroller.scrollToMessage(message.id, { align: 'start', behavior: 'smooth' })}
      >
        <span class="line-clamp-1 min-w-0">{trim(message.text)}</span>
      </button>
    {/each}
  </PopoverContent>
</Popover>
