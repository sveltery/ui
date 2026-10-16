<script lang="ts">
  import { Bubble, BubbleContent } from '@sveltery/components/bubble';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/components/card';
  import { Message, MessageContent } from '@sveltery/components/message';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '@sveltery/components/message-scroller';
  import { createChat } from './message-scroller/chat.svelte.js';
  import MessageText from './message-scroller/MessageText.svelte';
  import TranscriptOutline from './message-scroller/TranscriptOutline.svelte';

  const messages = createChat()
    .user('Review the incident handoff and tell me what to read first.', { id: 'vis-brief' })
    .assistant('Start with the summary and the impact section. The regression affected the upload queue, but the recovery path completed for every queued job.')
    .user('What was the customer impact?', { id: 'vis-impact' })
    .assistant(
      'Impact was limited to delayed processing.\n\nNo records were dropped, and the reconciliation worker confirmed each retry batch. Support saw confusion from two customers, but there were no checkout or billing errors.'
    )
    .user('What actions are open?', { id: 'vis-actions' })
    .assistant(
      'Keep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike.'
    )
    .user('Give me the follow-up checklist.', { id: 'vis-checklist' })
    .assistant(
      'After that, compare the queue recovery graph with the deploy timeline so the handoff shows exactly when processing returned to baseline. That makes it easier for support and engineering to answer the same customer questions without re-reading the whole incident thread.\n\nI would also add a short owner note beside each follow-up item. The checklist is small, but ownership keeps the retry-window decision, alert tuning, and support macro from drifting into separate follow-up conversations.\n\nKeep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike.'
    )
    .get();
  const userMessages = messages.filter((message) => message.role === 'user');
</script>

<MessageScrollerProvider scrollMargin={12}>
  <div class="relative flex flex-col gap-4">
    <div class="relative mx-auto w-full max-w-sm">
      <Card class="h-140 w-full gap-0">
        <CardHeader class="gap-1 border-b">
          <CardTitle>Transcript Outline</CardTitle>
          <CardDescription>Track the current anchored turn.</CardDescription>
        </CardHeader>
        <CardContent class="flex-1 overflow-hidden p-0">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent class="p-(--card-spacing)">
                {#each messages as message (message.id)}
                  {@const isUser = message.role === 'user'}
                  <MessageScrollerItem messageId={message.id} scrollAnchor={isUser}>
                    <Message align={isUser ? 'end' : 'start'}>
                      <MessageContent>
                        <Bubble variant={isUser ? 'muted' : 'ghost'}>
                          <BubbleContent class="space-y-2">
                            <MessageText text={message.text} />
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                {/each}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </CardContent>
      </Card>
      <div class="absolute top-1/2 -right-12 -translate-y-1/2">
        <TranscriptOutline messages={userMessages} />
      </div>
    </div>
    <div class="mx-auto max-w-sm px-0.5 text-center text-xs text-muted-foreground">Open the outline to jump between anchored turns as you read.</div>
  </div>
</MessageScrollerProvider>
