<script lang="ts">
  import { useMessageScroller } from '@sveltery/ui/message-scroller';
  import { Popover, PopoverContent, PopoverTrigger } from '@sveltery/ui/popover';
  import type { ChatMessage } from './chat.svelte.js';

  let { messages }: { messages: ChatMessage[] } = $props();
  const scroller = useMessageScroller();
  const currentAnchorId = $derived(scroller.visibility.currentAnchorId);
  const trim = (text: string) => (text.length > 42 ? `${text.slice(0, 39)}...` : text);
</script>

<Popover>
  <PopoverTrigger
    aria-label="Open transcript outline"
    class="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-md transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
  >
    {#each messages as message (message.id)}
      <span data-current={message.id === currentAnchorId} class="h-0.5 w-4 rounded-full bg-muted-foreground/40 data-[current=true]:bg-foreground"></span>
    {/each}
  </PopoverTrigger>
  <PopoverContent align="center" side="left" sideOffset={-28} class="flex w-64 flex-col gap-1 rounded-2xl p-1">
    {#each messages as message (message.id)}
      <button
        type="button"
        aria-current={currentAnchorId === message.id ? 'location' : undefined}
        class="flex min-h-7 items-center rounded-xl px-2 py-1.5 text-left text-sm transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground aria-current:bg-accent aria-current:text-accent-foreground"
        onclick={() => scroller.scrollToMessage(message.id, { align: 'start', behavior: 'smooth' })}
      >
        <span class="line-clamp-1 min-w-0">{trim(message.text)}</span>
      </button>
    {/each}
  </PopoverContent>
</Popover>
