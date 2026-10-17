<script lang="ts">
  import MessageCircleDashedIcon from '@lucide/svelte/icons/message-circle-dashed';
  import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';
  import { onDestroy } from 'svelte';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '$registry/bases/base/ui/empty';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from '$registry/bases/base/ui/message-scroller';
  import { Chat } from './message-scroller/chat.svelte.js';
  import Composer from './message-scroller/Composer.svelte';
  import MessageAnimated from './message-scroller/MessageAnimated.svelte';
  import { scrollThread } from './message-scroller/scripts.js';

  const chat = new Chat(scrollThread);
  onDestroy(() => chat.stop());
</script>

<MessageScrollerProvider autoScroll>
  <div class="relative flex flex-col gap-4">
    <Card class="mx-auto h-140 w-full max-w-sm gap-0">
      <CardHeader class="gap-1 border-b">
        <CardTitle>Streaming Messages</CardTitle>
        <CardDescription>Auto-scroll follows the live edge of the conversation.</CardDescription>
        <CardAction>
          <Button variant="outline" size="icon" aria-label="Reset stream" title="Reset" disabled={chat.messages.length === 0 || chat.busy} onclick={() => chat.reset()}>
            <RotateCwIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent class="flex-1 overflow-hidden p-0">
        {#if chat.messages.length === 0}
          <Empty class="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageCircleDashedIcon />
              </EmptyMedia>
              <EmptyTitle>Ready to Stream</EmptyTitle>
              <EmptyDescription>Press send to stream a scripted launch summary.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        {:else}
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent aria-busy={chat.busy} class="p-(--card-spacing)">
                {#each chat.messages as message (message.id)}
                  <MessageAnimated {message} scrollAnchor={message.role === 'user'} />
                {/each}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        {/if}
      </CardContent>
      <CardFooter class="flex-col gap-2">
        <Composer {chat} empty="No messages queued. Reset the stream." />
      </CardFooter>
    </Card>
    <div class="px-0.5 text-center text-xs text-muted-foreground">Streaming is simulated. <code>autoScroll</code> is enabled.</div>
  </div>
</MessageScrollerProvider>
