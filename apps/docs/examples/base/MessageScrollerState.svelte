<script lang="ts">
  import { Bubble, BubbleContent } from '@sveltery/components/bubble';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/components/card';
  import { Message, MessageContent } from '@sveltery/components/message';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '@sveltery/components/message-scroller';
  import type { ChatMessage } from './message-scroller/chat.svelte.js';
  import StatusBar from './message-scroller/StatusBar.svelte';

  const messages: ChatMessage[] = Array.from({ length: 12 }, (_, index) => ({
    id: `state-${index + 1}`,
    role: index % 2 === 0 ? 'user' : 'assistant',
    text: index % 2 === 0 ? `Check section ${index + 1} of the transcript.` : `Section ${index + 1} is ready. Scroll state updates without rerendering the rows.`,
  }));
</script>

<Card class="mx-auto h-112 w-full max-w-md gap-0">
  <CardHeader class="border-b">
    <CardTitle>Scroll State</CardTitle>
    <CardDescription>Read scroll state in JavaScript with <code>scrollable</code>.</CardDescription>
  </CardHeader>
  <CardContent class="min-h-0 flex-1 p-0">
    <MessageScrollerProvider defaultScrollPosition="start">
      <MessageScroller>
        <StatusBar />
        <MessageScrollerViewport>
          <MessageScrollerContent class="gap-4 p-4 pt-12">
            {#each messages as message (message.id)}
              {@const isUser = message.role === 'user'}
              <MessageScrollerItem messageId={message.id} scrollAnchor={isUser}>
                <Message align={isUser ? 'end' : 'start'}>
                  <MessageContent>
                    <Bubble variant={isUser ? 'default' : 'muted'}>
                      <BubbleContent>{message.text}</BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            {/each}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  </CardContent>
</Card>
