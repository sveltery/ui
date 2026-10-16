<script lang="ts">
  import { Bubble, BubbleContent } from '@sveltery/components/bubble';
  import { Button } from '@sveltery/components/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { Marker, MarkerContent } from '@sveltery/components/marker';
  import { Message, MessageContent } from '@sveltery/components/message';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '@sveltery/components/message-scroller';
  import { createChat } from './message-scroller/chat.svelte.js';
  import MessageText from './message-scroller/MessageText.svelte';

  const history = createChat()
    .user('Can you summarize the incident channel?')
    .assistant(
      'The first alert was a delayed export job. It started backing up around 09:42 UTC and triggered the warning once the retry queue crossed the threshold.\n\nNo customer-facing checkout paths were affected, but exports for larger workspaces were running about 12 minutes behind.'
    )
    .user('Was checkout affected?')
    .assistant(
      'No checkout errors were reported. Payment authorization, order creation, and confirmation emails stayed inside their normal latency bands.\n\nThe only elevated metric was export queue depth, which maps to analytics downloads instead of checkout.'
    )
    .user('What changed in the last deploy?')
    .assistant(
      'Only the export queue worker changed. The deploy moved large CSV jobs onto the shared retry policy, which made each failed attempt hold a worker slot longer than before.\n\nThe app deploy did not include checkout, pricing, or billing API changes.'
    )
    .user('Do we need to roll back?')
    .assistant(
      'Not yet. Queue depth is recovering after we reduced retry concurrency, and the oldest pending job is now under five minutes old.\n\nKeep rollback ready if the queue starts climbing again, but the current trend points toward recovery.'
    )
    .user('Keep watching for customer-visible issues.')
    .assistant(
      'I will watch the queue and support tags for another 15 minutes. I am tracking export failures, delayed download requests, and any support thread that mentions missing reports.\n\nIf those stay quiet through the next batch window, we can close this as an internal degradation.'
    )
    .get();
  const INITIAL_VISIBLE_COUNT = 5;

  let demoKey = $state(0);
  let visibleCount = $state(INITIAL_VISIBLE_COUNT);
  const visibleMessages = $derived(history.slice(-visibleCount));
  const canLoadHistory = $derived(visibleCount < history.length);
</script>

<MessageScrollerProvider>
  <div class="relative flex flex-col gap-4">
    <Card class="mx-auto h-140 w-full max-w-sm gap-0">
      <CardHeader class="gap-1 border-b">
        <CardTitle>Load History</CardTitle>
        <CardDescription>Prepended messages keep your place.</CardDescription>
        <CardAction>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Reset loaded messages"
            title="Reset"
            disabled={visibleCount === INITIAL_VISIBLE_COUNT}
            onclick={() => {
              visibleCount = INITIAL_VISIBLE_COUNT;
              demoKey++;
            }}
          >
            <IconPlaceholder lucide="RotateCwIcon" tabler="IconRotateClockwise" hugeicons="RotateClockwiseIcon" phosphor="ArrowClockwiseIcon" remixicon="RiRestartLine" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent class="flex-1 overflow-hidden p-0">
        {#key demoKey}
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent class="p-(--card-spacing)">
                {#each visibleMessages as message (message.id)}
                  {const isUser = $derived(message.role === 'user')}
                  <MessageScrollerItem messageId={message.id}>
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
                <MessageScrollerItem scrollAnchor={false}>
                  <Marker variant="separator">
                    <MarkerContent>End of Conversation</MarkerContent>
                  </Marker>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        {/key}
      </CardContent>
      <CardFooter class="flex flex-col items-center gap-2 border-t">
        <Button type="button" disabled={!canLoadHistory} onclick={() => (visibleCount = history.length)} class="w-full" variant="secondary">
          {canLoadHistory ? 'Load History' : 'History Loaded'}
        </Button>
        <p class="text-xs text-muted-foreground">Restore earlier messages while keeping your place.</p>
      </CardFooter>
    </Card>
    <div class="mx-auto max-w-sm px-0.5 text-center text-xs text-balance text-muted-foreground">Click Load History to load the entire conversation</div>
  </div>
</MessageScrollerProvider>
