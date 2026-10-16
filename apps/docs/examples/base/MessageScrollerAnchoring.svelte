<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '$registry/bases/base/ui/empty';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from '$registry/bases/base/ui/message-scroller';
  import { ToggleGroup, ToggleGroupItem } from '$registry/bases/base/ui/toggle-group';
  import type { ChatMessage } from './message-scroller/chat.svelte.js';
  import MessageAnimated from './message-scroller/MessageAnimated.svelte';

  const scriptedMessages: ChatMessage[] = [
    { id: 'anchor-1-user', role: 'user', text: 'Can you show me how anchoring behaves when a new prompt starts the turn?' },
    {
      id: 'anchor-1-assistant',
      role: 'assistant',
      text: 'Append the user prompt first, then append the assistant response. With User selected, the prompt settles near the top and the assistant response fills in below it.',
    },
    { id: 'anchor-2-user', role: 'user', text: 'What changes when assistant messages are the anchor?' },
    {
      id: 'anchor-2-assistant',
      role: 'assistant',
      text: 'Now each assistant response is the item `MessageScroller` keeps in view. This is useful when the reply is the moment you want readers to land on after each turn.',
    },
    { id: 'anchor-3-user', role: 'user', text: 'Can I switch roles and keep adding turns?' },
    {
      id: 'anchor-3-assistant',
      role: 'assistant',
      text: 'Yes. The next appended message with the selected role becomes the anchor, so you can compare user and assistant anchoring without resetting the demo.',
    },
  ];

  let anchorRole = $state<ChatMessage['role']>('user');
  let messages = $state<ChatMessage[]>([]);
  const nextMessage = $derived(scriptedMessages[messages.length]);
</script>

<div class="relative flex flex-col gap-4">
  <Card class="mx-auto h-140 w-full max-w-sm gap-0">
    <CardHeader class="border-b">
      <CardTitle>Anchoring Turns</CardTitle>
      <CardDescription>Choose which role settles near the top edge.</CardDescription>
      <CardAction>
        <Button type="button" variant="outline" size="icon" aria-label="Reset anchored turns" title="Reset" disabled={messages.length === 0} onclick={() => (messages = [])}>
          <IconPlaceholder lucide="RotateCwIcon" tabler="IconRotateClockwise" hugeicons="RotateClockwiseIcon" phosphor="ArrowClockwiseIcon" remixicon="RiRestartLine" />
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent class="min-h-0 flex-1 overflow-hidden p-0">
      {#if messages.length === 0}
        <Empty class="h-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconPlaceholder lucide="MessageCircleDashedIcon" tabler="IconMessageCircle" hugeicons="Message01Icon" phosphor="ChatCircleIcon" remixicon="RiChat1Line" />
            </EmptyMedia>
            <EmptyTitle>No anchored messages yet</EmptyTitle>
            <EmptyDescription>Send the first message to see the selected role anchor.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      {:else}
        <MessageScrollerProvider>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent class="p-(--card-spacing)">
                {#each messages as message (message.id)}
                  <MessageAnimated {message} scrollAnchor={message.role === anchorRole} userVariant="muted" assistantVariant="ghost" />
                {/each}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      {/if}
    </CardContent>
    <CardFooter>
      <ToggleGroup
        aria-label="Select scroll anchor role"
        value={[anchorRole]}
        onValueChange={(value) => {
          const role = value[0];
          if (role === 'user' || role === 'assistant') {
            anchorRole = role;
            messages = [];
          }
        }}
      >
        <ToggleGroupItem value="user" aria-label="Anchor user messages">User</ToggleGroupItem>
        <ToggleGroupItem value="assistant" aria-label="Anchor assistant messages">Assistant</ToggleGroupItem>
      </ToggleGroup>
      <Button type="button" size="icon" class="ml-auto" disabled={!nextMessage} onclick={() => nextMessage && messages.push(nextMessage)}>
        <IconPlaceholder lucide="ArrowUpIcon" tabler="IconArrowUp" hugeicons="ArrowUp02Icon" phosphor="ArrowUpIcon" remixicon="RiArrowUpLine" />
        <span class="sr-only">Send Message</span>
      </Button>
    </CardFooter>
  </Card>
  <div class="mx-auto max-w-xs px-0.5 text-center text-xs text-muted-foreground">Toggle the anchor role, then send messages to compare where turns settle.</div>
</div>
