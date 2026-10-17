<script lang="ts">
  import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
  import MessageCircleDashedIcon from '@lucide/svelte/icons/message-circle-dashed';
  import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';
  import { onDestroy } from 'svelte';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '$registry/bases/base/ui/empty';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from '$registry/bases/base/ui/message-scroller';
  import { NativeSelect, NativeSelectOption } from '$registry/bases/base/ui/native-select';
  import { animations, type AnimationId } from './message-scroller/animations.js';
  import { Chat, createChat } from './message-scroller/chat.svelte.js';
  import MessageAnimated from './message-scroller/MessageAnimated.svelte';

  const script = createChat()
    .user('Can user messages pop in like iMessage without breaking anchoring?')
    .sleep(1000)
    .assistant(
      'Yes. Animate the user row with transform and opacity, and let the assistant response stream normally below it.\n\nThat keeps the row measurement predictable while still giving the newly sent bubble a more tactile entrance.'
    )
    .user('What makes the animation feel more like iMessage?')
    .sleep(1000)
    .assistant(
      'Use a quick spring from the trailing edge: a little scale, a small upward move, and no layout animation.\n\nThe bubble feels tactile, but the measured row stays predictable, so anchoring and auto-scroll do not have to fight a changing layout.'
    )
    .user('Can I switch between presets while testing the same thread?')
    .sleep(1000)
    .assistant(
      'Yes. Keep the conversation in place while you change the preset, then send the next message to compare the new entrance against the same context.\n\nThat makes it easier to judge the difference between a subtle fade, a snappy pop, and a more dramatic entrance without rebuilding the scenario each time.'
    );

  const chat = new Chat(script, { delayMs: 15 });
  let animation = $state<AnimationId>('fade');
  onDestroy(() => chat.stop());
</script>

<div class="relative flex flex-col gap-4">
  <Card class="mx-auto h-140 w-full max-w-sm gap-0">
    <CardHeader class="border-b">
      <CardTitle>Animation</CardTitle>
      <CardDescription>Choose how user messages are animated when they are added to the conversation.</CardDescription>
      <CardAction class="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon" aria-label="Reset animated messages" title="Reset" disabled={chat.messages.length === 0 || chat.busy} onclick={() => chat.reset()}>
          <RotateCwIcon />
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent class="min-h-0 flex-1 overflow-hidden p-0">
      {#if chat.messages.length === 0}
        <Empty class="h-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageCircleDashedIcon />
            </EmptyMedia>
            <EmptyTitle>No Messages Yet</EmptyTitle>
            <EmptyDescription>Click the button below to send the first message.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      {:else}
        <MessageScrollerProvider>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent aria-busy={chat.busy} class="p-(--card-spacing)">
                {#each chat.messages as message (message.id)}
                  <MessageAnimated {message} {animation} userVariant="muted" assistantVariant="ghost" />
                {/each}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      {/if}
    </CardContent>
    <CardFooter class="border-t">
      <NativeSelect aria-label="Animation preset" bind:value={animation}>
        {#each Object.values(animations) as preset (preset.id)}
          <NativeSelectOption value={preset.id}>{preset.name}</NativeSelectOption>
        {/each}
      </NativeSelect>
      <Button type="button" size="icon" class="ml-auto" disabled={!chat.next || chat.busy} onclick={() => chat.send()}>
        <ArrowUpIcon />
        <span class="sr-only">Send Message</span>
      </Button>
    </CardFooter>
  </Card>
  <div class="mx-auto max-w-sm px-0.5 text-center text-xs text-balance text-muted-foreground">Select an animation then click send to see it in action.</div>
</div>
