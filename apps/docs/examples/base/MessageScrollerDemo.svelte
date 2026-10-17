<script lang="ts">
  import GlobeIcon from '@lucide/svelte/icons/globe';
  import ImageIcon from '@lucide/svelte/icons/image';
  import MessageCircleDashedIcon from '@lucide/svelte/icons/message-circle-dashed';
  import PaperclipIcon from '@lucide/svelte/icons/paperclip';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';
  import TelescopeIcon from '@lucide/svelte/icons/telescope';
  import { onDestroy, type Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
  import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '$registry/bases/base/ui/empty';
  import { InputGroupButton } from '$registry/bases/base/ui/input-group';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from '$registry/bases/base/ui/message-scroller';
  import { Chat } from './message-scroller/chat.svelte.js';
  import Composer from './message-scroller/Composer.svelte';
  import MessageAnimated from './message-scroller/MessageAnimated.svelte';
  import { scrollThread } from './message-scroller/scripts.js';

  const chat = new Chat(scrollThread);
  onDestroy(() => chat.stop());
</script>

{#snippet addButton(props: HTMLButtonAttributes, _state: unknown, children?: Snippet)}
  <InputGroupButton {...props} aria-label="Add files" type="button" size="icon-sm" variant="outline">{@render children?.()}</InputGroupButton>
{/snippet}

<MessageScrollerProvider>
  <div class="relative flex flex-col gap-4">
    <Card class="mx-auto h-140 w-full max-w-sm gap-0">
      <CardHeader class="gap-1 border-b">
        <CardTitle>New Chat</CardTitle>
        <CardDescription>How can I help you today?</CardDescription>
        <CardAction>
          <Button variant="outline" size="icon" aria-label="Reset conversation" title="Reset" disabled={chat.busy} onclick={() => chat.reset()}>
            <RotateCwIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent class="flex-1 overflow-hidden p-0">
        {#if chat.messages.length === 0}
          <Empty class="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageCircleDashedIcon />
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
        <Composer {chat} empty="No messages queued. Reset the conversation.">
          <DropdownMenu>
            <DropdownMenuTrigger render={addButton}>
              <PlusIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" class="w-44">
              <DropdownMenuItem>
                <PaperclipIcon />
                Add Photos & Files
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ImageIcon />
                Create Image
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TelescopeIcon />
                Deep Research
              </DropdownMenuItem>
              <DropdownMenuItem>
                <GlobeIcon />
                Web Search
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Composer>
      </CardFooter>
    </Card>
    <div class="px-0.5 text-center text-xs text-muted-foreground">Demo is read only. Press send to send messages.</div>
  </div>
</MessageScrollerProvider>
