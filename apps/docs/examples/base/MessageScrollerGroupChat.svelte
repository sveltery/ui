<script lang="ts">
  import { Bubble, BubbleContent } from '$registry/bases/base/ui/bubble';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Marker, MarkerContent } from '$registry/bases/base/ui/marker';
  import { Message, MessageContent, MessageHeader } from '$registry/bases/base/ui/message';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '$registry/bases/base/ui/message-scroller';

  type GroupChatItem =
    | { id: string; type: 'event'; text: string; scrollAnchor?: boolean }
    | { id: string; type: 'message'; sender: string; role: 'assistant' | 'participant'; text: string; scrollAnchor?: boolean };

  const currentUser = 'Grace';

  const initialItems: GroupChatItem[] = [
    { id: 'group-1', type: 'message', sender: 'Grace', role: 'participant', text: '@mary, the astrophage line keeps matching Venus energy output. Can you check my math?' },
    {
      id: 'group-2',
      type: 'message',
      sender: 'Mary (Agent)',
      role: 'assistant',
      text: 'Yes. Confirmed. The curve points to a microorganism harvesting stellar energy and breeding near carbon dioxide. If @rocky agrees, this is the clue we need.',
    },
    { id: 'group-3', type: 'message', sender: 'Grace', role: 'participant', text: 'ping @rocky', scrollAnchor: true },
  ];

  const rockyMarker: GroupChatItem = { id: 'group-4', type: 'event', text: 'Rocky has joined the chat', scrollAnchor: true };
  const rockyMessage: GroupChatItem = {
    id: 'group-5',
    type: 'message',
    sender: 'Rocky',
    role: 'participant',
    text: 'Amaze. Astrophage eats light, makes heat, goes to carbon dioxide. Rocky has fuel model. Grace is smart.',
  };

  let demoKey = $state(0);
  let rockyTurn = $state<'idle' | 'marker' | 'message'>('idle');
  const items = $derived(rockyTurn === 'message' ? [...initialItems, rockyMarker, rockyMessage] : rockyTurn === 'marker' ? [...initialItems, rockyMarker] : initialItems);
</script>

<div class="relative flex flex-col gap-4">
  <Card class="mx-auto h-140 w-full max-w-sm gap-0">
    <CardHeader class="gap-1 border-b">
      <CardTitle>Group Chat</CardTitle>
      <CardDescription>A group chat with several participants and an assistant. The Marker is marked as a turn.</CardDescription>
      <CardAction>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Reset conversation"
          title="Reset"
          disabled={rockyTurn === 'idle'}
          onclick={() => {
            rockyTurn = 'idle';
            demoKey++;
          }}
        >
          <IconPlaceholder lucide="RotateCwIcon" tabler="IconRotateClockwise" hugeicons="RotateClockwiseIcon" phosphor="ArrowClockwiseIcon" remixicon="RiRestartLine" />
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent class="min-h-0 flex-1 p-0">
      <MessageScrollerProvider>
        {#key demoKey}
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent class="p-(--card-spacing)">
                {#each items as item (item.id)}
                  {#if item.type === 'message'}
                    {const isCurrentUser = $derived(item.sender === currentUser)}
                    <MessageScrollerItem messageId={item.id} scrollAnchor={item.scrollAnchor}>
                      <Message align={isCurrentUser ? 'end' : 'start'}>
                        <MessageContent>
                          {#if !isCurrentUser}
                            <MessageHeader>{item.sender}</MessageHeader>
                          {/if}
                          <Bubble variant={isCurrentUser ? 'muted' : item.role === 'assistant' ? 'ghost' : 'tinted'}>
                            <BubbleContent>{item.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  {:else}
                    <MessageScrollerItem scrollAnchor={item.scrollAnchor}>
                      <Marker variant="separator">
                        <MarkerContent>{item.text}</MarkerContent>
                      </Marker>
                    </MessageScrollerItem>
                  {/if}
                {/each}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        {/key}
      </MessageScrollerProvider>
    </CardContent>
    <CardFooter class="flex flex-col items-center gap-2 border-t">
      <Button type="button" disabled={rockyTurn === 'message'} onclick={() => (rockyTurn = rockyTurn === 'idle' ? 'marker' : 'message')} class="w-full" variant="secondary">
        {rockyTurn === 'idle' ? 'Add Rocky' : 'Send Message as Rocky'}
      </Button>
      <p class="text-xs text-muted-foreground">
        {rockyTurn === 'idle' ? 'This will create a marker and make it the anchor' : "Now send Rocky's reply into the conversation"}
      </p>
    </CardFooter>
  </Card>
  <div class="mx-auto max-w-sm px-0.5 text-center text-xs text-balance text-muted-foreground">
    When a user joins, a marker is created. <code>scrollAnchor</code> on the marker marks it as the next turn
  </div>
</div>
