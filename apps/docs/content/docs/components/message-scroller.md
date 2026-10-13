---
title: Message Scroller
description: A chat scroll container that anchors turns, opens saved transcripts, follows streamed responses, loads history without jumping, and jumps to any message.
---

<ComponentPreview name="base/MessageScrollerDemo" />

## What Makes a Great Streaming Chat Experience

Building a chat interface used to be simple. You create an inverted list with
an input. Type a message, it appends at the bottom. When a reply comes in, the
list grows and scrolls. Done.

Streaming breaks that model. Messages arrive in chunks while you may still be
reading, scrolling, or looking somewhere else entirely.

Now the challenge is preserving the reader's place while the conversation keeps
changing. Get that wrong and the experience feels jumpy: people are pulled to
the bottom, lose context, and have to find their way back.

In practice, this comes down to scroll: when to follow, when to hold, and when
to let the reader decide. A great streaming chat should:

1. **Move only when the reader asked to move.** If someone is reading, don’t pull them somewhere else. Auto-scroll should never be the default.
2. **Follow only while they’re following.** If they’re at the live edge, keep the stream in view. If they scroll away, leave them there.
3. **Every interaction is a signal.** Scrolling is not the only one. Selecting text, using the keyboard, opening a link, or searching should all stop the interface from moving.
4. **Start a new turn near the top of the viewport.** This gives the new turn somewhere it can be read from the beginning.
5. **Then stream in the answer.** The answer should grow into the screen, not immediately push everything away.
6. **Keep part of the previous conversation in context.** The prompt and reply should stay visually connected, and enough of the previous turn should remain visible so the reader knows where they are.
7. **Let new content arrive offscreen.** The conversation can keep streaming without changing what the reader is looking at.
8. **Show what’s happening out of view.** Make it clear when a response is still streaming or when new messages have arrived.
9. **Make it easy to return to the latest reply.** A “Jump to latest” action should bring the reader back and resume following.
10. **Let people jump anywhere in the conversation.** Long threads need message links, search, unread markers, and direct navigation.
11. **Reopen where the reader left off.** A saved conversation should open at the last meaningful turn. Often this is the last user message. Not the absolute bottom.
12. **Keep the reader’s place when layout changes.** Images load. Markdown expands. Code blocks render. Older messages appear above. None of that should make the reader lose their place.
13. **Handle interruptions without stealing position.** Stopping, retrying, regenerating, branching, or errors should not unexpectedly move the conversation.
14. **Stay responsive in long threads.** Streaming text, markdown, code, images, and long history should still feel responsive.
15. **Be accessible without the noise.** Keep the transcript navigable, preserve keyboard focus, and announce important events at a comfortable pace.

**Never move the reader against their intent.**

## MessageScroller

MessageScroller is a chat transcript scroller built for these behaviors.
`MessageScrollerProvider` owns the scroll state and transcript-row behavior:
opening position, streamed output, new-turn anchoring, prepended history,
visibility, and scroll controls. `MessageScroller` is the styled frame that
renders inside it.

MessageScroller is scoped to the scroll viewport. It does not own messages, AI state,
transport, persistence, branching, or model state. Your product code stays
focused on composing messages, markers, tools, attachments, and prompt inputs.

It gives you the scroll behavior that chat needs, without taking over the rest
of the chat UI. And it stays fast, even in long conversations with rich
markdown.

Message Scroller is built on `@sveltery/message-scroller`, a Svelte package that ports `@shadcn/react/message-scroller`. It has no runtime dependencies.

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/message-scroller
```

### Copy the component

Copy the following files into `src/lib/components/ui/message-scroller`.

<ComponentSource name="message-scroller" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Message } from '$lib/components/ui/message';
  import {
    MessageScroller,
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerProvider,
    MessageScrollerViewport,
  } from '$lib/components/ui/message-scroller';
</script>
```

```svelte
<MessageScrollerProvider>
  <MessageScroller>
    <MessageScrollerViewport>
      <MessageScrollerContent>
        {#each messages as message (message.id)}
          <MessageScrollerItem messageId={message.id} scrollAnchor={message.role === 'user'}>
            <Message />
          </MessageScrollerItem>
        {/each}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
```

`MessageScroller` fills its parent, so place it inside a height-constrained
container.

```svelte
<div class="flex h-screen flex-col">
  <MessageScrollerProvider>
    <MessageScroller class="flex-1">
      <!-- transcript -->
    </MessageScroller>
  </MessageScrollerProvider>
</div>
```

## Composition

```text
MessageScrollerProvider
└── MessageScroller
    ├── MessageScrollerViewport
    │   └── MessageScrollerContent
    │       ├── MessageScrollerItem
    │       ├── MessageScrollerItem
    │       └── MessageScrollerItem
    └── MessageScrollerButton
```

- **`MessageScrollerProvider`** — the headless root. Owns scroll state and the
  behavior props for opening position, auto-scroll, anchoring, scroll commands,
  and visibility tracking. It renders no element of its own.
- **`MessageScroller`** — the styled frame. Lays out the viewport, content, and
  controls inside the provider.
- **`MessageScrollerViewport`** — the scrollable element. Receives native scroll
  events and preserves the visible row when older messages are prepended.
- **`MessageScrollerContent`** — the transcript container. Holds the rows and
  provides the live-region defaults for new messages.
- **`MessageScrollerItem`** — the transcript row boundary. Wrap every direct
  child of the content so the scroller can measure, anchor, preserve position,
  track visibility, and jump to it. An item can be a message, marker, typing
  indicator, separator, join/leave event, or "load earlier" row.
- **`MessageScrollerButton`** — the scroll control. Scrolls to the start or end of the transcript and is inert until there is content in its direction.

## Example

A complete chat with a composer, a thinking marker while the reply is pending, and a stop button.

<ComponentPreview name="base/MessageScrollerExample" />

## Core Concepts

### Anchoring Turns

A turn is the part of the conversation that starts a new exchange. In a simple
AI chat, that is usually the user's message and the assistant reply that follows.

An anchor is the row the viewport should treat as the start of that turn. Mark
that row with `scrollAnchor`. When a new anchor is appended, the viewport moves
it near the top and keeps a peek of the previous item above it, so the new turn
does not feel detached from its context.

```svelte
<!-- This tells the scroller to anchor the user's message for the next turn. -->
<MessageScrollerItem messageId={message.id} scrollAnchor={message.role === 'user'}>
  …
</MessageScrollerItem>
```

Scroll anchors are not tied to message role. You can turn any row into an anchor:
a user message, a system marker, a handoff event, or anything else that starts a
meaningful turn. `MessageScroller` only needs to know which row should anchor the
viewport.

In the following example, the user's message is anchored. When you send a new message, the viewport anchors it near the top and appends the assistant reply below it. Toggle the anchor to the assistant's message to see the difference.

<ComponentPreview name="base/MessageScrollerAnchoring" />

### Group Chat

In a group chat, the turn boundary is more specific than "the user message". It is often
the message that asks the model to respond, or a marker like "Marcus joined the
chat". Typing indicators and history controls usually should not anchor.

Because anchoring is role-independent, you can anchor a marker just as easily as
a message.

```svelte
<MessageScrollerItem messageId="marcus-joined" scrollAnchor>
  <Marker variant="separator">
    <MarkerContent>Marcus joined the chat</MarkerContent>
  </Marker>
</MessageScrollerItem>
```

<ComponentPreview name="base/MessageScrollerGroupChat" />

### Keeping Context Visible

When a new turn starts, it should still feel like part of the same continuous
thread. `scrollPreviousItemPeek` keeps a slice of the previous item visible
above the anchor, so the reader keeps their context instead of feeling like the
conversation restarted on a blank page.

```svelte
<!-- Keep 64px of the previous turn visible above the newly anchored row. -->
<MessageScrollerProvider scrollPreviousItemPeek={64}>
  <MessageScroller>
    <!-- anchored turns -->
  </MessageScroller>
</MessageScrollerProvider>
```

Adjust the peek amount in the example below to see how it affects the conversation.

<ComponentPreview name="base/MessageScrollerPreviousContext" />

### Following the Live Edge

When the reader is at the live edge, either because they stayed there or
returned there, `autoScroll` keeps streamed replies in view as they grow.
Scrolling away from the live edge releases the view, whether by wheel, touch,
keyboard scroll keys, or dragging the scrollbar. An explicit message jump
releases it too. New chunks can then arrive without moving the reader.

`autoScroll` composes with turn anchoring. When a new turn anchors near the
top, the view stays put while the reply streams into the room below it. Once
the reply fills the viewport, the reader is back at the live edge and
follow-output takes over from the anchor.

```svelte
<MessageScrollerProvider autoScroll>
  <MessageScroller>
    <!-- streamed turns -->
  </MessageScroller>
</MessageScrollerProvider>
```

<ComponentPreview name="base/MessageScrollerStreaming" />

Calling `scrollToEnd`, or pressing `MessageScrollerButton`, re-engages
follow-output when `autoScroll` is enabled, so a reader who scrolled away can
return to the live edge and keep following. The root and viewport expose
`data-autoscrolling` while that programmatic scroll to the latest message runs,
so you can conditionally apply styles during the transition.

### Opening Saved Threads

It can seem reasonable to reopen a saved thread at the absolute end of the
transcript, but that often drops the reader into the conversation without enough
context. A better default is `"last-anchor"`: show the last meaningful turn,
like the user's latest message, with the reply below it.

That gives the reader an immediate place in the thread. They can see what they
asked, where the answer starts, and continue from there without reconstructing
the conversation from the bottom edge.

```svelte
<MessageScrollerProvider defaultScrollPosition="last-anchor">
  <MessageScroller>
    <!-- transcript -->
  </MessageScroller>
</MessageScrollerProvider>
```

<ComponentPreview name="base/MessageScrollerOpeningPosition" hideCode />

`"last-anchor"` is keyed on `scrollAnchor`, not message role. If no anchor
exists, or the last anchored turn already fits in the viewport, it falls back to
`"end"`.

Use `"start"` when you want to resume at the beginning of a conversation, or
`"end"` when the absolute latest message is the right place to land.

### Avoiding a Flash on Reload

A scroll container always opens at the top. HTML has no way to set `scrollTop`,
so a server-rendered transcript shows the oldest messages first. After
JavaScript runs, `defaultScrollPosition` moves the view, and you see a jump.

When `defaultScrollPosition` is `"end"` or `"last-anchor"`, the viewport has
`data-pending-scroll` until that position is applied. The styled viewport stays
hidden while the attribute is present, so you see the frame instead of the jump.
`"start"` does not need this.

If you want `"end"` visible on first paint, add an inline script right after the
viewport. Give the viewport an `id`, scroll it to the bottom, and remove
`data-pending-scroll`.

```svelte
<script lang="ts">
  const scrollToEndScript = `<script>(function () {
  var viewport = document.getElementById('messages');
  if (!viewport) {
    return;
  }
  viewport.scrollTop = viewport.scrollHeight;
  viewport.removeAttribute('data-pending-scroll');
})()<\/script>`;
</script>

<MessageScroller>
  <MessageScrollerViewport id="messages">
    <MessageScrollerContent>
      <!-- transcript -->
    </MessageScrollerContent>
  </MessageScrollerViewport>
  {@html scrollToEndScript}
  <MessageScrollerButton />
</MessageScroller>
```

Put the script in your page, not in the scroller. It only works for `"end"`, and
only when the messages are already in the HTML. The `<\/script>` escape keeps the
tag from closing your component's own script block. Svelte does not warn when an
attribute changes between the server HTML and hydration, so there is nothing to
suppress. If you use a Content Security Policy, add a `nonce` attribute to the
script tag in the string.

Do not use this script with `"last-anchor"`. Skip it when messages load on the
client.

### Loading Earlier Messages

Loading earlier messages should not move the conversation the reader is already
looking at. When older rows are prepended above the current transcript,
`MessageScrollerViewport` preserves the visible row so the reader stays in the
same place while history loads above them.

This is enabled by default through `preserveScrollOnPrepend`.

<ComponentPreview name="base/MessageScrollerLoadHistory" />

Use stable `messageId` values for message rows. That gives the scroller a
specific row to preserve instead of guessing from whichever pixel happens to sit
at the viewport edge.

### Animating New Messages

`MessageScrollerItem` can be animated. Transitions are directives on elements,
so keep `messageId` and `scrollAnchor` on the item and put `in:fly` on an
element inside it. Use transform and opacity for the entrance.

A common chat pattern is to animate the user's message when it is sent, then let
the assistant reply stream into a regular row below it. Start the user row below
its final position so it feels like it rises from the live edge of the viewport.

```svelte
<script lang="ts">
  import { fly } from 'svelte/transition';
</script>

<MessageScrollerItem messageId={message.id} scrollAnchor={message.role === 'user'}>
  <div in:fly={{ y: 24, duration: 300 }}>
    <Message>…</Message>
  </div>
</MessageScrollerItem>
```

<ComponentPreview name="base/MessageScrollerAnimation" />

Avoid animating height, margin, or padding for row entrances; those changes can
fight the scroller's positioning work. If the reader prefers reduced motion,
skip the entrance animation and keep the scroll behavior the same.

### Jumping to Messages

Search results, permalinks, outline items, and toolbar buttons often need to
drive the transcript from outside the message list. Use `useMessageScroller` for
those controls. Because it reads from `MessageScrollerProvider`, it works in any
component inside the provider, including controls rendered outside the
`MessageScroller` frame. Call it while the component initializes.

```svelte
<script lang="ts">
  import { useMessageScroller } from '$lib/components/ui/message-scroller';

  const scroller = useMessageScroller();
</script>

<button onclick={() => scroller.scrollToMessage('m42', { align: 'start', behavior: 'smooth' })}>
  Jump to message
</button>
<button onclick={() => scroller.scrollToEnd()}>Latest</button>
<button onclick={() => scroller.scrollToStart()}>Top</button>
```

<ComponentPreview name="base/MessageScrollerCommands" hideCode />

`scrollToMessage` targets the `messageId` on `MessageScrollerItem`, so rows that
need to be addressable should have stable ids. `scrollToMessage` returns `false`
when the target is not mounted and cannot be queued.

`scrollToMessage` can queue a target before items exist, which covers
client-resolved permalinks while the transcript mounts. After rows have mounted,
a missing id returns `false` instead of starting a guessed retry loop. A `true`
result means the scroll ran or was queued, not that the row is already in view.

### Tracking the Reader's Position

Use `scroller.visibility` to track the reader's position in the conversation. A
common example is a table-of-contents or a jump menu that highlights the current
anchored turn. It is reactive, so read it in the template or in a `$derived`.

```svelte
<script lang="ts">
  import { useMessageScroller } from '$lib/components/ui/message-scroller';

  const scroller = useMessageScroller();
  const currentAnchorId = $derived(scroller.visibility.currentAnchorId);
</script>
```

<ComponentPreview name="base/MessageScrollerVisibility" hideCode />

`currentAnchorId` answers "where am I" by reporting the current anchored turn,
and it stays set after that anchor scrolls above the viewport. `visibleMessageIds`
answers "what is on screen", in document order.

Visibility is pay-for-what-you-use. Tracking only runs while an effect, a
`$derived` or the template reads `scroller.visibility`, and rows need a
`messageId` to participate.

### Reading Scroll State

Use `scroller.scrollable` when you need scroll state in JavaScript, such as a
status indicator or a custom "jump to latest" control. It reports which edges
the viewport can still scroll toward; "at the start/end" is the negation
(`!start` / `!end`), and "scrollable at all" is `start || end`. For styling the
scroller itself, prefer the `data-scrollable` attribute.

```svelte
<script lang="ts">
  import { useMessageScroller } from '$lib/components/ui/message-scroller';

  const scroller = useMessageScroller();
</script>

{#if scroller.scrollable.end}
  <p>Newer messages below</p>
{/if}
```

Read the properties where you use them. Destructuring `scrollable` or
`visibility` copies the value once and stops following the scroller.

<ComponentPreview name="base/MessageScrollerScrollable" />

The example below turns the same two flags into a status bar.

<ComponentPreview name="base/MessageScrollerState" />

## Performance

`MessageScroller` is benchmarked against large transcripts with markdown and
composed message rows.

Our performance goal for `MessageScroller` is to keep the scroll hot path outside of component state: no updates to
transcript rows, no forced layout on every scroll, and as little off-screen paint
work as the browser can avoid.

Scroll position, anchoring, and follow-output are tracked imperatively and mirrored onto the root and viewport through `data-*` attributes, so scrolling and streaming do not update transcript rows.

The styled `MessageScrollerItem` also ships with `content-visibility: auto` and
`contain-intrinsic-size`. Rows stay in the DOM for selection, copy,
find-in-page, SSR, and assistive tech, but the browser can skip rendering work
for rows far outside the viewport.

Visibility tracking is pay-for-what-you-use. A jump menu or active
turn indicator costs nothing until something reads
`scroller.visibility`.

This is comfortable for the expected range of a chat transcript: hundreds to low
thousands of turns, including messages with markdown and composed components.

## Virtualization

Virtualization is intentionally left outside the primitive. `MessageScroller`
renders real DOM rows and stays fast well into the thousands of turns (see
[Performance](#performance)), so most transcripts never need it.

When a transcript is large enough to need virtualization, use
`MessageScrollerViewport` as the scroll element and let the virtualizer own the
rows. The sketch below shows the shape with a generic `virtualizer` that exposes
its total height, the visible rows and a way to measure a row. Any virtualizer
for Svelte follows it.

```svelte showLineNumbers
<script lang="ts">
  let { messages }: { messages: { id: string; text: string }[] } = $props();

  let viewport = $state<HTMLElement>();

  // Create the virtualizer of your choice. It reads `viewport` as the scroll element.
  const virtualizer = createVirtualizer({
    count: messages.length,
    getScrollElement: () => viewport,
    estimateSize: () => 86,
    getItemKey: (index) => messages[index].id,
    overscan: 8,
  });
</script>

<MessageScrollerProvider>
  <MessageScroller>
    <MessageScrollerViewport {@attach (node) => (viewport = node)}>
      <MessageScrollerContent class="block min-h-full">
        <div class="relative w-full" style:height="{virtualizer.getTotalSize()}px">
          {#each virtualizer.getVirtualItems() as row (row.key)}
            <div
              {@attach virtualizer.measureElement}
              data-index={row.index}
              class="absolute start-0 top-0 w-full"
              style:transform="translateY({row.start}px)"
            >
              <Message>{messages[row.index].text}</Message>
            </div>
          {/each}
        </div>
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
```

## Accessibility

`MessageScroller` keeps the scroll container keyboard reachable and the
transcript announceable without forcing a specific message UI.

`MessageScrollerViewport` is a labelled, keyboard-focusable scroll region by
default. It uses `role="region"`, `aria-label="Messages"`, and `tabindex="0"`,
so keyboard users can focus the transcript and scroll it directly.

`MessageScrollerContent` marks the transcript as a live region with
`role="log"` and `aria-relevant="additions"`. New rows can be announced, but
streamed text mutations do not have to be announced token by token.

```svelte
<MessageScrollerContent aria-busy={status === 'streaming'}>
  <!-- messages -->
</MessageScrollerContent>
```

Pass `aria-busy` while a turn streams if announcements should wait for the
completed message row.

`MessageScrollerButton` renders a real button. When there is nothing to scroll
toward, it sets `inert`, uses `tabindex="-1"`, and exposes `data-active="false"`
so inactive scroll controls do not create extra focus stops.

## Unstyled

The behavior in `MessageScroller` comes from the `@sveltery/message-scroller`
package. To use it directly with your own markup and styles, import the parts
from the package.

```svelte
<script lang="ts">
  import * as MessageScroller from '@sveltery/message-scroller';
</script>

<MessageScroller.Provider autoScroll>
  <MessageScroller.Root>
    <MessageScroller.Viewport>
      <MessageScroller.Content>
        <MessageScroller.Item messageId="m1" scrollAnchor>…</MessageScroller.Item>
      </MessageScroller.Content>
    </MessageScroller.Viewport>
    <MessageScroller.Button />
  </MessageScroller.Root>
</MessageScroller.Provider>
```

The props, data attributes and `useMessageScroller` are the ones documented in the API reference below. The unstyled parts add no classes, so hide the viewport while `data-pending-scroll` is present yourself, using `visibility: hidden`.

## API Reference

The props, data attributes, and `useMessageScroller` for every part. The unstyled parts in `@sveltery/message-scroller` have the same API, minus `variant` and `size` on the button.

### MessageScrollerProvider

The headless root. It owns scroll state and the behavior props, and provides
them to the parts and `useMessageScroller`. It renders no element of its own.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `autoScroll` | `boolean` | `false` | Follow new content only while the reader is already at the live edge. Wheel, touch, keyboard scroll, and explicit jumps release it. |
| `defaultScrollPosition` | `'start' \| 'end' \| 'last-anchor'` | `'end'` | Opening position on the first non-empty render, applied once. `'last-anchor'` opens at the last `scrollAnchor` row and falls back to `'end'` when the turn fits or no anchor exists. For `'end'` and `'last-anchor'`, the viewport has `data-pending-scroll` until the position is applied. See [Avoiding a Flash on Reload](#avoiding-a-flash-on-reload). |
| `scrollEdgeThreshold` | `number` | `8` | Distance from either edge that still counts as being at the start or end. Controls state attributes and scroll button visibility. |
| `scrollMargin` | `number` | `0` | Margin applied to the aligned edge for `scrollToMessage`, visibility, and programmatic targets. |
| `scrollPreviousItemPeek` | `number` | `64` | Extra margin added to `scrollMargin` when a newly appended `scrollAnchor` item is positioned so part of the previous item stays visible. |

### MessageScroller

The frame and layout container. It fills its parent, so use it inside a
height-constrained layout, within a `MessageScrollerProvider`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | | Added to the frame |

`MessageScroller` passes every other attribute to its `div`.

The root mirrors the scroll-state attributes below (the viewport carries them
too), so you can style the container by scroll state, such as edge fades on the
frame. Hide the viewport while `data-pending-scroll` is present, using
`visibility: hidden` so layout still exists for the opening scroll. The styled
viewport does this for you.

| Data attribute | Value | Description |
| --- | --- | --- |
| `data-scrollable` | `"start"` \| `"end"` \| `"start end"` \| _absent_ | Edges the viewport can scroll toward. Query one with `[data-scrollable~="end"]`. Absent means it fits. |
| `data-autoscrolling` | present | Present while the viewport is programmatically scrolling to the latest message. |
| `data-pending-scroll` | present | Present until `defaultScrollPosition` (`'end'` or `'last-anchor'`) is applied, or skipped for an empty transcript. Hide the viewport while it is set. See [Avoiding a Flash on Reload](#avoiding-a-flash-on-reload). |

### MessageScrollerViewport

The scrollable viewport.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `preserveScrollOnPrepend` | `boolean` | `true` | Keep the first visible message item stable when older rows are prepended. |
| `role` | `string` | `'region'` | Landmark role for the labelled scrollable transcript viewport. |
| `aria-label` | `string` | `'Messages'` | Accessible name for the scrollable chat transcript. |
| `tabindex` | `number` | `0` | Makes the transcript viewport keyboard-scrollable. |
| `class` | `string` | | Added to the viewport |

`MessageScrollerViewport` passes every other attribute to its `div`. It carries the same `data-scrollable`, `data-autoscrolling` and `data-pending-scroll` attributes as the root.

### MessageScrollerContent

The transcript content element. Every direct child should be a
`MessageScrollerItem`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `role` | `string` | `'log'` | ARIA role applied to the message list for live announcements. |
| `aria-relevant` | `string` | `'additions'` | Live-region updates to announce. Defaults to new transcript rows only. |
| `aria-busy` | `boolean` | | Marks the live region busy while a turn streams, if needed. |
| `spacerClass` | `string` | | Class for the internal spacer used to make room for anchored rows. |
| `class` | `string` | | Added to the content |

`MessageScrollerContent` passes every other attribute to its `div`.

### MessageScrollerItem

One transcript row: a message, marker, typing row, separator, or load-more row.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `messageId` | `string` | | Stable row id used by `scrollToMessage`, visibility, and prepend preservation. |
| `scrollAnchor` | `boolean` | `false` | Marks this row as a turn boundary that can anchor newly appended turns. |
| `class` | `string` | | Added to the item |

`MessageScrollerItem` passes every other attribute to its `div`.

| Data attribute | Value | Description |
| --- | --- | --- |
| `data-message-id` | `string` | Mirrors `messageId` when provided. |
| `data-scroll-anchor` | `"true"` \| `"false"` | Mirrors `scrollAnchor`. |

### MessageScrollerButton

A button that scrolls to the start or end of the transcript. It is inert and
removed from the tab order when there is nothing to scroll toward.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `behavior` | `ScrollBehavior` | `'smooth'` | Native scroll behavior used when the button scrolls to its target edge. |
| `direction` | `'start' \| 'end'` | `'end'` | Transcript edge the button scrolls toward. |
| `variant` | `ButtonVariants['variant']` | `'secondary'` | The `Button` variant. Styled button only. |
| `size` | `ButtonVariants['size']` | `'icon-sm'` | The `Button` size. Styled button only. |
| `children` | `Snippet` | | Custom button content. Defaults to the arrow icon and an accessible label. |
| `render` | `Snippet<[props, state]>` | | Render your own element. Spread `props` onto it. `state` is `{ active, direction }`. |
| `class` | `string` | | Added to the button |

`MessageScrollerButton` passes every other attribute to its `button`, and runs your `onclick` before it scrolls. Call `event.preventDefault()` there to cancel the scroll.

| Data attribute | Value | Description |
| --- | --- | --- |
| `data-direction` | `"start"` \| `"end"` | Mirrors `direction`. |
| `data-active` | `"true"` \| `"false"` | Whether this button can currently scroll. |

### useMessageScroller

Returns the scroller of the nearest `MessageScrollerProvider`. Call it while a component initializes. It throws outside a provider.

```svelte
<script lang="ts">
  const scroller = useMessageScroller();
</script>
```

Imperative transcript controls.

| Method | Type | Description |
| --- | --- | --- |
| `scrollToMessage` | `(messageId: string, options?) => boolean` | Scroll to a mounted message id. |
| `scrollToEnd` | `(options?) => boolean` | Scroll to the latest message. |
| `scrollToStart` | `(options?) => boolean` | Scroll to the top. |

All commands return `false` when the command could not be applied.
`scrollToStart` and `scrollToEnd` return `false` only when the viewport is not
mounted yet. `scrollToMessage` returns `false` when the target is not mounted and
cannot be queued.

Command options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `"start"` \| `"center"` \| `"end"` \| `"nearest"` | `"start"` | How a message target aligns in the viewport. |
| `behavior` | `ScrollBehavior` | `"auto"` | Native scroll behavior for the command. |
| `scrollMargin` | `number` | provider `scrollMargin` | Margin applied to the aligned edge for this command. |

#### scrollable

Which edges the viewport can scroll toward, for sibling UI that needs the values
in JavaScript. It is reactive. Prefer the `data-scrollable` attribute for styling
the scroller itself.

| Value | Type | Description |
| --- | --- | --- |
| `start` | `boolean` | Whether the viewport can scroll toward the start. Content is hidden above (`!start` means at the top). |
| `end` | `boolean` | Whether the viewport can scroll toward the end. Content is hidden below (`!end` means at the bottom). Stays `false` while follow-output is keeping the reader at the live edge. |

#### visibility

Visibility state for outline, search, and active-turn UI. It is reactive and
lazy. Tracking starts when something reads it and stops when nothing does, so
visibility work is only paid for when a consumer needs it.

| Value | Type | Description |
| --- | --- | --- |
| `currentAnchorId` | `string \| null` | The current anchored turn, based on the last `scrollAnchor` item at or above the reading line. |
| `visibleMessageIds` | `string[]` | Message ids intersecting the viewport, in document order. |

Filter `visibleMessageIds` in your app when you need a narrower outline, such as
user messages, anchored turns, or search hits.
