# @sveltery/svelte

Unstyled components for Svelte 5. Each one ports the behavior of its counterpart in [shadcn/ui](https://github.com/shadcn-ui/ui)'s `@shadcn/react`, renders plain elements and ships no styles. Import each from its own subpath:

| Subpath | Component |
| --- | --- |
| `@sveltery/svelte/message-scroller` | A chat transcript scroller |
| `@sveltery/svelte/questionnaire` | A step-by-step questionnaire form |

The styled [Message Scroller](https://ui.sveltery.dev/docs/components/message-scroller) and [Questionnaire](https://ui.sveltery.dev/docs/components/questionnaire) components in Sveltery UI are built on them.

## Install

```sh
npm install @sveltery/svelte
```

## Message Scroller

It follows new messages while the reader is at the bottom, anchors a new turn to the top of the viewport, keeps the scroll position when older messages are prepended, and opens at the end of the transcript.

```svelte
<script lang="ts">
  import * as MessageScroller from '@sveltery/svelte/message-scroller';

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

## Questionnaire

It shows one question at a time inside a form, tracks answers and validation, and supports skipping, previous and next, and keyboard shortcuts for choices.

```svelte
<script lang="ts">
  import * as Questionnaire from '@sveltery/svelte/questionnaire';
</script>

<Questionnaire.Root items={[{ name: 'size', required: true }, { name: 'notes' }]} shortcuts="letters">
  <Questionnaire.Progress />
  <Questionnaire.Item name="size">
    <Questionnaire.Title>Pick a size</Questionnaire.Title>
    <Questionnaire.Choices>
      <Questionnaire.Choice value="small">Small</Questionnaire.Choice>
      <Questionnaire.Choice value="large">Large</Questionnaire.Choice>
    </Questionnaire.Choices>
    <Questionnaire.Error />
  </Questionnaire.Item>
  <Questionnaire.Item name="notes">
    <Questionnaire.Title>Anything else?</Questionnaire.Title>
    <Questionnaire.Input />
  </Questionnaire.Item>
  <Questionnaire.Previous />
  <Questionnaire.Next />
  <Questionnaire.Submit />
</Questionnaire.Root>
```

`Root` renders a `<form>`, so the answers submit with it like any other form fields.

Add the styled version to your app with `npx @sveltery/ui@latest add questionnaire`.

## License

MIT. See `THIRD_PARTY_NOTICES.md` for the upstream license.
