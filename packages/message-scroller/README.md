# @sveltery/message-scroller

A chat transcript scroller for Svelte 5. It follows new messages while the reader is at the bottom, anchors a new turn to the top of the viewport, keeps the scroll position when older messages are prepended, and opens at the end of the transcript. It ports the behavior of the message scroller in [shadcn/ui](https://github.com/shadcn-ui/ui), renders plain elements and ships no styles.

The styled [Message Scroller](https://ui.sveltery.dev/docs/components/message-scroller) component in Sveltery UI is built on it.

## Install

```sh
npm install @sveltery/message-scroller
```

## Usage

```svelte
<script lang="ts">
  import * as MessageScroller from '@sveltery/message-scroller';

  let { messages } = $props();
</script>

<MessageScroller.Provider>
  <MessageScroller.Root>
    <MessageScroller.Viewport>
      <MessageScroller.Content>
        {#each messages as message (message.id)}
          <MessageScroller.Item messageId={message.id} scrollAnchor={message.role === 'user'}>
            {message.text}
          </MessageScroller.Item>
        {/each}
      </MessageScroller.Content>
    </MessageScroller.Viewport>
    <MessageScroller.Button />
  </MessageScroller.Root>
</MessageScroller.Provider>
```

`useMessageScroller()` returns the scroller to any component inside `Provider`. Call its `scrollToEnd()`, `scrollToStart()` or `scrollToMessage(id)` to move the transcript.

Add the styled version to your app with `npx @sveltery/ui@latest add message-scroller`.

## License

MIT. See `THIRD_PARTY_NOTICES.md` for the upstream license.
