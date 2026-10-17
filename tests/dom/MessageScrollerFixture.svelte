<script lang="ts">
  import { untrack } from 'svelte';
  import { Button, Content, Item, Provider, Root, Viewport, type MessageScroller, type MessageScrollerDefaultScrollPosition } from '@sveltery/svelte/message-scroller';
  import MessageScrollerProbe from './MessageScrollerProbe.svelte';
  import MessageScrollerVisibility from './MessageScrollerVisibility.svelte';

  type Message = { id: string; height?: number; key?: string; register?: false; scrollAnchor?: boolean };
  type Options = {
    messages: Message[];
    autoScroll?: boolean;
    defaultScrollPosition?: MessageScrollerDefaultScrollPosition;
    scrollMargin?: number;
    preserveScrollOnPrepend?: boolean;
    contentPaddingStart?: number;
    contentPaddingEnd?: number;
    contentRole?: string;
    contentAriaBusy?: boolean;
    contentAriaRelevant?: 'additions text';
    restoreMessageId?: string;
    observeVisibility?: boolean;
    onStartClick?: (event: MouseEvent) => void;
  };

  let { initial }: { initial: Options } = $props();
  let options = $state(untrack(() => initial));
  let scroller: MessageScroller | undefined;
  let scrollableRuns = 0;

  export function update(next: Partial<Options>) { options = { ...options, ...next }; }
  export function api() { return scroller!; }
  export function scrollableEffectRuns() { return scrollableRuns; }
</script>

<Provider autoScroll={options.autoScroll} defaultScrollPosition={options.defaultScrollPosition} scrollMargin={options.scrollMargin}>
  <Root data-testid="scroller">
    <MessageScrollerProbe capture={(value) => (scroller = value)} restore={options.restoreMessageId} onscrollable={() => (scrollableRuns += 1)} />
    <Viewport data-testid="viewport" preserveScrollOnPrepend={options.preserveScrollOnPrepend}>
      <Content
        data-testid="content"
        data-padding-start={options.contentPaddingStart ?? 0}
        data-padding-end={options.contentPaddingEnd ?? 0}
        role={options.contentRole}
        aria-busy={options.contentAriaBusy}
        aria-relevant={options.contentAriaRelevant}
      >
        {#each options.messages as message (message.key ?? message.id)}
          <Item data-testid="message" data-test-height={message.height ?? 40} messageId={message.register === false ? undefined : message.id} scrollAnchor={message.scrollAnchor}>{message.id}</Item>
        {/each}
      </Content>
    </Viewport>
    <Button data-testid="button">Scroll</Button>
    <Button data-testid="start-button" direction="start" onclick={options.onStartClick} />
    <Button>
      {#snippet render(props, state)}
        <button {...props} data-testid="rendered" data-state="{state.direction} {state.active}">Custom</button>
      {/snippet}
    </Button>
    {#if options.observeVisibility}<MessageScrollerVisibility />{/if}
  </Root>
</Provider>
