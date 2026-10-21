# Chat & Messaging

Components for conversation UI. Compose these instead of hand-rolling bubbles, scroll containers, dividers or attachment cards.

Install: `npx @sveltery/ui@latest add message-scroller message bubble attachment marker trace code-block`

Fetch the pages before you build: [message-scroller.md](https://ui.sveltery.dev/docs/components/message-scroller.md), [message.md](https://ui.sveltery.dev/docs/components/message.md), [bubble.md](https://ui.sveltery.dev/docs/components/bubble.md), [attachment.md](https://ui.sveltery.dev/docs/components/attachment.md), [marker.md](https://ui.sveltery.dev/docs/components/marker.md), [trace.md](https://ui.sveltery.dev/docs/components/trace.md) and [code-block.md](https://ui.sveltery.dev/docs/components/code-block.md). They win over this page. The chat examples there use `Chat` from `@ai-sdk/svelte`.

## Contents

- Scrollable threads use MessageScroller
- Message rows use Message
- Message surfaces use Bubble
- Attachments use Attachment
- System notes and dividers use Marker
- Assistant activity uses Trace
- Code and tool output use CodeBlock
- Streaming, anchoring and jump-to-latest are built in

---

## Scrollable threads use MessageScroller

A conversation that scrolls, follows new messages, restores position or jumps to a message uses `MessageScroller`. Don't build a raw overflow container with scroll handlers, and don't use `ScrollArea` for it.

The parts nest in a fixed order. Wrap every direct child of the content in a `MessageScrollerItem`, so the scroller can measure and anchor it. `MessageScrollerButton` goes inside `MessageScroller`, after the viewport.

**Incorrect:**

```svelte
<div bind:this={scrollEl} onscroll={handleScroll} class="flex-1 overflow-y-auto">
  <div class="flex flex-col gap-6 p-4">
    {#each messages as message (message.id)}
      <ChatMessage {message} />
    {/each}
  </div>
</div>
```

**Correct:**

```svelte
<MessageScrollerProvider autoScroll>
  <MessageScroller>
    <MessageScrollerViewport>
      <MessageScrollerContent>
        {#each messages as message (message.id)}
          <MessageScrollerItem messageId={message.id} scrollAnchor={message.role === 'user'}>
            <Message align={message.role === 'user' ? 'end' : 'start'}>
              <!-- message content -->
            </Message>
          </MessageScrollerItem>
        {/each}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
```

---

## Message rows use Message

`Message` lays out one row: avatar, header, content and footer. Group consecutive rows from one sender with `MessageGroup`. `align="end"` is the current user's side, `align="start"` everyone else.

```svelte
<Message align="start">
  <MessageAvatar>
    <Avatar>
      <AvatarImage src={sender.avatar} alt={sender.name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  </MessageAvatar>
  <MessageContent>
    <MessageHeader>{sender.name}</MessageHeader>
    <Bubble>
      <BubbleContent>{text}</BubbleContent>
    </Bubble>
    <MessageFooter>{time}</MessageFooter>
  </MessageContent>
</Message>
```

---

## Message surfaces use Bubble

The message surface is `Bubble` + `BubbleContent`, never a styled `div` with `bg-muted` or `bg-primary`.

- `variant`: `default`, `secondary`, `muted`, `tinted`, `outline`, `ghost` or `destructive`.
- `align`: `start` or `end`, matching the `Message`.
- `BubbleReactions` holds reactions. `side` (`top`, `bottom`) and `align` (`start`, `end`) place it.

**Incorrect:**

```svelte
<div class="w-fit rounded-2xl bg-primary px-3 py-2 text-primary-foreground">{text}</div>
```

**Correct:**

```svelte
<Bubble variant="default" align="end">
  <BubbleContent>{text}</BubbleContent>
  <BubbleReactions side="bottom" align="end">
    <Badge variant="secondary">👍 2</Badge>
  </BubbleReactions>
</Bubble>
```

---

## Attachments use Attachment

File and image attachments use `Attachment`, not `Item` or a custom card. Wire `state` to the real upload status instead of adding a spinner.

- `state`: `idle`, `uploading`, `processing`, `error` or `done`. `uploading` and `processing` shimmer the title.
- `size`: `default`, `sm` or `xs`. `orientation`: `horizontal` or `vertical`.
- `AttachmentGroup` lays out several in a scrolling row.

```svelte
<Attachment state="done">
  <AttachmentMedia variant="icon">
    <FileTextIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>homepage-feedback.pdf</AttachmentTitle>
    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Download">
      <DownloadIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```

For an image, use `<AttachmentMedia variant="image">` with an `<img>` child.

---

## System notes and dividers use Marker

Status lines ("Sarah joined"), date dividers ("Today") and labeled separators are `Marker`, not a `Separator` and a centered span.

- `variant`: `default`, `separator` or `border`.
- `MarkerIcon` holds a leading icon. `MarkerContent` holds the label.

**Incorrect:**

```svelte
<div class="flex items-center gap-3 py-2">
  <Separator class="flex-1" />
  <span class="text-xs text-muted-foreground">Today</span>
  <Separator class="flex-1" />
</div>
```

**Correct:**

```svelte
<Marker variant="separator">
  <MarkerContent>Today</MarkerContent>
</Marker>
```

---

## Assistant activity uses Trace

Reasoning, tool calls, steps, sources and file reads are each a `TraceLine` in a `Trace`. Not a hand-rolled `Collapsible`, and not a `Marker`.

- A `TraceLine` holds a `TraceIcon` and a `TraceTitle`, then an optional `TraceDescription` for a count, duration or diff stat. `status` goes on the line: `running`, `error`, `pending` or none. Never dim a line with `opacity-*`.
- Behavior wraps the line:
  - nothing to open → the `TraceLine` alone,
  - expands → `TraceCollapsible` > `TraceCollapsibleTrigger` > `TraceLine`, then `TraceCollapsibleContent`,
  - link → `<a href>` > `TraceLine`,
  - overlay → `SheetTrigger` (or `DialogTrigger`, `DrawerTrigger`, `PopoverTrigger`) > `TraceLine`.
- Never render the trigger as the line with a `render` snippet. The trigger stays a real button.
- A `TraceCollapsibleTrigger` always has a `TraceCollapsibleContent`. A tool row is a `TraceLine` until its output arrives.
- Put one `Trace` around each run of activity parts. A text part ends the run.
- Open state goes on `TraceCollapsible` with `open` or `bind:open`.
- For an AI Elements pattern such as Tool, Reasoning, Sources or Plan, fetch [trace.md](https://ui.sveltery.dev/docs/components/trace.md) and copy its composition.

**Incorrect:**

```svelte
<Collapsible bind:open>
  <CollapsibleTrigger class="text-sm text-muted-foreground">
    {streaming ? 'Thinking...' : 'Thought for a few seconds'}
  </CollapsibleTrigger>
  <CollapsibleContent>{part.text}</CollapsibleContent>
</Collapsible>
```

**Correct:**

```svelte
<TraceCollapsible>
  <TraceCollapsibleTrigger>
    <TraceLine status={running ? 'running' : undefined}>
      <TraceIcon><BrainIcon /></TraceIcon>
      <TraceTitle>{running ? 'Thinking' : 'Thought'}</TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>{part.text}</TraceCollapsibleContent>
</TraceCollapsible>
```

A tool row whose output may not exist yet:

```svelte
{#snippet line()}
  <TraceLine status={output === undefined ? 'running' : undefined}>
    <TraceIcon><TerminalIcon /></TraceIcon>
    <TraceTitle>Ran {command}</TraceTitle>
  </TraceLine>
{/snippet}

{#if output === undefined}
  {@render line()}
{:else}
  <TraceCollapsible>
    <TraceCollapsibleTrigger>{@render line()}</TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <CodeBlock size="sm">
        <CodeBlockContent wrap class="max-h-64" code={output} />
      </CodeBlock>
    </TraceCollapsibleContent>
  </TraceCollapsible>
{/if}
```

---

## Code and tool output use CodeBlock

Code, terminal output, tool input and output, logs and diffs are a `CodeBlock`, never a hand-rolled `<pre>`.

- `CodeBlockContent` takes plain text in its `code` prop, or `CodeBlockLine` children. Add `wrap` for tool output and errors, and a `max-h-*` class to cap the height.
- Errors use `variant="destructive"` on `CodeBlock`.
- For highlighted source, call `useHighlightedCode(() => code, () => language)` and render each of its `lines` in a `CodeBlockLine` with `{@html}`. Don't highlight tool output.
- `CodeBlockCopyButton` takes the text to copy as `value`.

**Incorrect:**

```svelte
<pre class="rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap">{output}</pre>
```

**Correct:**

```svelte
<CodeBlock>
  <CodeBlockHeader>
    <CodeBlockTitle>Output</CodeBlockTitle>
    <CodeBlockActions>
      <CodeBlockCopyButton value={output} />
    </CodeBlockActions>
  </CodeBlockHeader>
  <CodeBlockContent wrap class="max-h-72" code={output} />
</CodeBlock>
```

---

## Streaming, anchoring and jump-to-latest are built in

Don't write stick-to-bottom code, a `ResizeObserver` or `scrollTop` math.

- **Follow while streaming.** `autoScroll` on `MessageScrollerProvider` keeps new content in view and stops when the user scrolls up.
- **Anchor a turn.** `scrollAnchor` on a `MessageScrollerItem` holds that row in view, usually the user's message.
- **Jump to latest.** `MessageScrollerButton` shows itself when the user scrolls away. Don't gate it behind your own scroll state.
- **Open a saved transcript.** `defaultScrollPosition="end"` or `"last-anchor"` on the provider. Fetch [message-scroller.md](https://ui.sveltery.dev/docs/components/message-scroller.md) for the script that avoids a jump on server-rendered transcripts.
- **Read scroller state.** `useMessageScroller()` inside the provider, only when the parts can't express what you need.

For a "thinking…" indicator, put the `shimmer` utility on the text. See [styling.md](./styling.md#use-the-shimmer-and-scroll-fade-utilities).
