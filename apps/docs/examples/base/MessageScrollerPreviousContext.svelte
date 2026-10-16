<script lang="ts">
  import { onDestroy } from 'svelte';
  import { Button } from '@sveltery/components/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from '@sveltery/components/message-scroller';
  import { Slider } from '@sveltery/components/slider';
  import { Chat } from './message-scroller/chat.svelte.js';
  import Composer from './message-scroller/Composer.svelte';
  import MessageAnimated from './message-scroller/MessageAnimated.svelte';
  import { scrollThread } from './message-scroller/scripts.js';

  const DEFAULT_PEEK = 64;
  const chat = new Chat(scrollThread, { initial: 2, delayMs: 35 });
  let demoKey = $state(0);
  let peek = $state(DEFAULT_PEEK);
  onDestroy(() => chat.stop());
</script>

{#key demoKey}
  <MessageScrollerProvider scrollMargin={24} scrollPreviousItemPeek={peek}>
    <div class="relative flex flex-col gap-4">
      <Card class="mx-auto h-140 w-full max-w-sm gap-0">
        <CardHeader class="gap-1 border-b">
          <CardTitle>Keeping Context Visible</CardTitle>
          <CardDescription>New turns keep part of the previous reply in view.</CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="icon"
              aria-label="Reset context example"
              title="Reset"
              disabled={chat.busy}
              onclick={() => {
                chat.reset();
                peek = DEFAULT_PEEK;
                demoKey++;
              }}
            >
              <IconPlaceholder lucide="RotateCwIcon" tabler="IconRotateClockwise" hugeicons="RotateClockwiseIcon" phosphor="ArrowClockwiseIcon" remixicon="RiRestartLine" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent class="flex-1 overflow-hidden p-0">
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
        </CardContent>
        <CardFooter class="flex-col gap-2">
          <Composer {chat} empty="No messages queued. Reset the context.">
            <div class="flex w-28 items-center gap-2">
              <span class="text-xs text-muted-foreground tabular-nums">{peek}px</span>
              <Slider aria-label="Previous context peek" bind:value={peek} min={64} max={128} step={1} disabled={chat.busy} />
            </div>
          </Composer>
        </CardFooter>
      </Card>
      <div class="px-0.5 text-center text-xs text-muted-foreground">Adjust the slider and send. Observe the previous message peek</div>
    </div>
  </MessageScrollerProvider>
{/key}
