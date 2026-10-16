<script lang="ts">
  import { Bubble, BubbleContent } from '$registry/bases/base/ui/bubble';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Message, MessageContent } from '$registry/bases/base/ui/message';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '$registry/bases/base/ui/message-scroller';
  import { Tabs, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';
  import MessageText from './message-scroller/MessageText.svelte';

  const messages = [
    { id: 'open-1', role: 'user', text: 'This is the first message the user sent in the conversation.' },
    { id: 'open-2', role: 'assistant', text: 'Workspace creation rose 8%, but first invite completion only rose 2%.' },
    { id: 'open-3', role: 'user', text: 'This is the last message the user sent in the conversation.' },
    {
      id: 'open-4',
      role: 'assistant',
      text: 'Start with the invite step. Teams are creating workspaces but waiting to add collaborators.\n\nRecommended follow-up:\n\n1. Compare invite drop-off by account size.\n2. Check whether users who skip invites still return within 24 hours.\n3. Review the empty-state copy on the first project screen.\n4. Segment activation by template, since template users may not need invites right away.\n\nIf that pattern holds, the next experiment should make collaboration useful earlier instead of prompting for invites harder.',
    },
  ] as const;

  const positions = ['start', 'end', 'last-anchor'] as const;

  let positionKey = $state(0);
  let position = $state<(typeof positions)[number]>('last-anchor');
</script>

<div class="relative flex flex-col gap-4">
  <Card class="mx-auto h-140 w-full max-w-sm gap-0">
    <CardHeader class="gap-1 border-b">
      <CardTitle>Opening Position</CardTitle>
      <CardDescription>Choose where a saved transcript opens.</CardDescription>
    </CardHeader>
    <CardContent class="flex-1 overflow-hidden p-0">
      <!-- The opening position applies once, so a new key replays it. -->
      {#key positionKey}
        <MessageScrollerProvider defaultScrollPosition={position}>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent class="p-(--card-spacing)">
                {#each messages as message (message.id)}
                  {const isUser = $derived(message.role === 'user')}
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
        </MessageScrollerProvider>
      {/key}
    </CardContent>
    <CardFooter class="flex items-center justify-center border-t">
      <Tabs
        value={position}
        onValueChange={(value) => {
          if (positions.includes(value as (typeof positions)[number])) {
            position = value as (typeof positions)[number];
            positionKey++;
          }
        }}
        class="w-full"
      >
        <TabsList class="w-full">
          {#each positions as option (option)}
            <TabsTrigger value={option}>{option}</TabsTrigger>
          {/each}
        </TabsList>
      </Tabs>
    </CardFooter>
  </Card>
  <div class="mx-auto max-w-sm px-0.5 text-center text-xs text-muted-foreground">
    Toggle the <code>defaultScrollPosition</code> to see where the transcript starts when you open the thread
  </div>
</div>
