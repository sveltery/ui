<script lang="ts">
  import { onDestroy } from 'svelte';
  import { Bubble, BubbleContent } from '@sveltery/ui/bubble';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@sveltery/ui/input-group';
  import { Marker, MarkerContent, MarkerIcon } from '@sveltery/ui/marker';
  import { Message, MessageContent } from '@sveltery/ui/message';
  import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '@sveltery/ui/message-scroller';
  import { Spinner } from '@sveltery/ui/spinner';
  import { Chat, createChat } from './message-scroller/chat.svelte.js';

  const script = createChat()
    .user('Hello there!')
    .sleep(2000)
    .assistant("Hey, how's it going?")
    .user(
      "I'm prototyping an AI chat surface for our product docs.\n\nCan you sketch a sensible component breakdown and call out anything I'd regret baking into v1?"
    )
    .sleep(2000)
    .assistant(
      `## Recommended layout

Treat the chat as three layers so scrolling and the composer never fight each other:

| Layer | Responsibility |
| --- | --- |
| **Shell** | Card or page frame, title, status indicator |
| **Transcript** | \`overflow-y-auto\` message list |
| **Composer** | Input group, send, stop |

### Message rendering

- **User messages**: right-aligned, muted background, \`max-w-[80%]\`.
- **Assistant messages**: full width within the column; use \`whitespace-pre-wrap\` for text.

### Suggested component split

\`\`\`svelte
<ChatCard>
  <ChatHeader {status} />
  <ChatTranscript {messages} />
  <ChatComposer onsubmit={send} onstop={stop} />
</ChatCard>
\`\`\`

### v1 pitfalls to avoid

1. **Inlining transport logic in the UI** — keep scripted/demo transport beside your example, not inside shared components.
2. **Fixed transcript height without \`overflow-hidden\`** — parent must clip, child must scroll, or the composer jumps.
3. **Not giving the scroller an auto-scroll flag** — long replies should stay pinned to the bottom unless the user scrolls up.

### Practical next step

Start with plain \`whitespace-pre-wrap\` text to validate spacing and scroll behavior. Once the transcript feels right, you can swap assistant text rendering to a richer renderer if you need it.

Want me to walk through auto-scroll vs. manual scroll-to-bottom next?`
    )
    .user('What about message spacing when one reply is short and the next is really long?')
    .sleep(2000)
    .assistant(
      `Good question. The scroll container should own vertical rhythm, not individual bubbles.

Use a consistent \`gap\` on the message list (something like \`gap-4\` or \`gap-6\`) so short and long messages sit on the same grid. For assistant replies that span many paragraphs, keep everything in one bubble rather than splitting on every line break — otherwise the transcript feels choppy when you're skimming.

When a long reply streams in, pin the viewport to the bottom with \`MessageScrollerProvider autoScroll\` until the user scrolls up. If they've scrolled away, show a scroll-to-bottom affordance instead of yanking them back mid-read.

That's usually enough for v1. Fancy diff animations or per-paragraph fade-ins can wait until you've validated that the base scroll + composer layout holds up on real devices.`
    )
    .user('Thanks, that helps.')
    .sleep(1000)
    .assistant("Happy to help — send another message when you're ready to keep stepping through the demo.");

  const chat = new Chat(script, { delayMs: 10 });
  onDestroy(() => chat.stop());
</script>

<ExampleWrapper>
  <Example title="Chat" containerClass="self-start">
    <Card class="h-140">
      <CardHeader>
        <CardTitle>How can I help you today?</CardTitle>
        <CardDescription>Status: {chat.status}</CardDescription>
      </CardHeader>
      <CardContent class="min-h-0 flex-1 overflow-hidden p-0">
        <MessageScrollerProvider>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent class="p-(--card-spacing)">
                {#each chat.messages as message (message.id)}
                  {@const isUser = message.role === 'user'}
                  <MessageScrollerItem messageId={message.id} scrollAnchor={isUser}>
                    <Message align={isUser ? 'end' : 'start'}>
                      <MessageContent>
                        <Bubble variant={isUser ? 'default' : 'muted'}>
                          <BubbleContent class="whitespace-pre-wrap">{message.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                {/each}
                {#if chat.status === 'submitted'}
                  <MessageScrollerItem scrollAnchor={false}>
                    <Marker role="status">
                      <MarkerIcon>
                        <Spinner />
                      </MarkerIcon>
                      <MarkerContent>Thinking...</MarkerContent>
                    </Marker>
                  </MessageScrollerItem>
                {/if}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </CardContent>
      <CardFooter>
        <form
          class="w-full"
          id="chat-form"
          onsubmit={(event) => {
            event.preventDefault();
            chat.send();
          }}
        >
          <InputGroup>
            <InputGroupTextarea placeholder="Ask me anything..." class="h-10 min-h-10 overflow-y-auto" value={chat.busy ? '' : (chat.next?.text ?? '')} readonly />
            <InputGroupAddon align="block-end" class="p-2">
              <InputGroupButton variant="default" size="icon-sm" type="submit" disabled={!chat.next || chat.busy} class="ml-auto data-[hidden=true]:hidden" data-hidden={chat.busy}>
                <IconPlaceholder lucide="ArrowUpIcon" tabler="IconArrowUp" hugeicons="ArrowUp02Icon" phosphor="ArrowUpIcon" remixicon="RiArrowUpLine" />
                <span class="sr-only">Send</span>
              </InputGroupButton>
              <InputGroupButton size="icon-sm" type="button" class="ml-auto data-[hidden=true]:hidden" data-hidden={!chat.busy} onclick={() => chat.stop()}>
                <IconPlaceholder lucide="StopCircleIcon" tabler="IconPlayerStop" hugeicons="StopCircleIcon" phosphor="StopCircleIcon" remixicon="RiStopCircleLine" />
                <span class="sr-only">Stop</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </CardFooter>
    </Card>
  </Example>
</ExampleWrapper>
