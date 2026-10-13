<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from '@sveltery/ui/message-scroller';
  import type { ChatMessage } from './message-scroller/chat.svelte.js';
  import MessageAnimated from './message-scroller/MessageAnimated.svelte';
  import ScrollStateFooter from './message-scroller/ScrollStateFooter.svelte';

  const messages: ChatMessage[] = Array.from({ length: 12 }, (_, index) => ({
    id: `scrollable-${index + 1}`,
    role: index % 2 === 0 ? 'user' : 'assistant',
    text:
      index % 2 === 0
        ? `Review scroll checkpoint ${index + 1}.`
        : `Checkpoint ${index + 1} is synced. The scrollable state updates as the viewport moves.\n\nWhen the reader is at the first message, the footer should only point them down. Once they move into the middle of the transcript, it should explain that both directions are available.\n\nAt the latest message, the footer should switch again and only point them back up.`,
  }));
</script>

<div class="mx-auto flex w-full max-w-sm flex-col gap-4">
  <Card class="h-140 w-full gap-0 overflow-hidden">
    <CardHeader class="gap-1 border-b">
      <CardTitle>Scroll Status</CardTitle>
      <CardDescription>Where the reader can go scroll to based on current scroll position.</CardDescription>
    </CardHeader>
    <MessageScrollerProvider defaultScrollPosition="start">
      <CardContent class="flex-1 overflow-hidden p-0">
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent class="gap-4 p-(--card-spacing)">
              {#each messages as message (message.id)}
                <MessageAnimated {message} scrollAnchor={message.role === 'user'} userVariant="muted" assistantVariant="ghost" />
              {/each}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </CardContent>
      <ScrollStateFooter />
    </MessageScrollerProvider>
  </Card>
  <div class="px-0.5 text-center text-xs text-muted-foreground">Scroll the transcript to see the footer update.</div>
</div>
