<script lang="ts">
  import { page } from '$app/state';
  import { MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerRoot, MessageScrollerViewport, type MessageScrollerDefaultScrollPosition } from '@sveltery/base/message-scroller';
  import { onMount } from 'svelte';
  import Probe from './Probe.svelte';

  type Row = { id: string; height?: number; scrollAnchor?: boolean };

  const params = page.url.searchParams;
  const autoScroll = params.has('autoScroll');
  const defaultScrollPosition = (params.get('open') ?? undefined) as MessageScrollerDefaultScrollPosition | undefined;
  const scrollPreviousItemPeek = params.has('peek') ? Number(params.get('peek')) : undefined;
  const count = Number(params.get('count') ?? 8);
  let items = $state<Row[]>(params.has('items') ? JSON.parse(params.get('items')!) : Array.from({ length: count }, (_, index) => ({ id: `m${index}` })));

  // Playwright replaces the rows the way an app re-renders its transcript.
  onMount(() => {
    (window as unknown as { thread: { set(next: Row[]): void } }).thread = { set: (next) => (items = next) };
  });
</script>

<MessageScrollerProvider {autoScroll} {defaultScrollPosition} {scrollPreviousItemPeek}>
  <MessageScrollerRoot data-testid="scroller">
    <MessageScrollerViewport aria-label="viewport" style="height: 200px; overflow-y: auto">
      <MessageScrollerContent style="display: flex; flex-direction: column">
        {#each items as item (item.id)}
          <MessageScrollerItem messageId={item.id} scrollAnchor={item.scrollAnchor} style="height: {item.height ?? 80}px; flex: none">{item.id}</MessageScrollerItem>
        {/each}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton behavior="auto">Scroll to end</MessageScrollerButton>
    <Probe jumpTo={params.get('jump') ?? undefined} visibility={params.has('visibility')} />
  </MessageScrollerRoot>
</MessageScrollerProvider>
