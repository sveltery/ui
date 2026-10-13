<script lang="ts">
  import { onDestroy } from 'svelte';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@sveltery/ui/empty';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from '@sveltery/ui/message-scroller';
  import { Chat } from './message-scroller/chat.svelte.js';
  import Composer from './message-scroller/Composer.svelte';
  import MessageAnimated from './message-scroller/MessageAnimated.svelte';
  import { scrollThread } from './message-scroller/scripts.js';

  const chat = new Chat(scrollThread);
  onDestroy(() => chat.stop());
</script>

<MessageScrollerProvider>
  <div class="relative flex flex-col gap-4">
    <Card class="mx-auto h-140 w-full max-w-sm gap-0">
      <CardHeader class="gap-1 border-b">
        <CardTitle>New Chat</CardTitle>
        <CardDescription>How can I help you today?</CardDescription>
        <CardAction>
          <Button variant="outline" size="icon" aria-label="Reset conversation" title="Reset" disabled={chat.busy} onclick={() => chat.reset()}>
            <IconPlaceholder lucide="RotateCwIcon" tabler="IconRotateClockwise" hugeicons="RotateClockwiseIcon" phosphor="ArrowClockwiseIcon" remixicon="RiRestartLine" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent class="flex-1 overflow-hidden p-0">
        {#if chat.messages.length === 0}
          <Empty class="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconPlaceholder lucide="MessageCircleDashedIcon" tabler="IconMessageCircle" hugeicons="Message01Icon" phosphor="ChatCircleIcon" remixicon="RiChat1Line" />
              </EmptyMedia>
              <EmptyTitle>Morning, shadcn!</EmptyTitle>
              <EmptyDescription>What are we working on today? Press send to start a new conversation</EmptyDescription>
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
        <Composer {chat} empty="No messages queued. Reset the conversation." />
      </CardFooter>
    </Card>
    <div class="px-0.5 text-center text-xs text-muted-foreground">Demo is read only. Press send to send messages.</div>
  </div>
</MessageScrollerProvider>
