<script lang="ts">
  import { page } from '$app/state';
  import { Button, Content, Item, Provider, Root, Viewport, type MessageScrollerDefaultScrollPosition } from '@sveltery/svelte/message-scroller';
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

<Provider {autoScroll} {defaultScrollPosition} {scrollPreviousItemPeek}>
  <Root data-testid="scroller">
    <Viewport aria-label="viewport" style="height: 200px; overflow-y: auto">
      <Content style="display: flex; flex-direction: column">
        {#each items as item (item.id)}
          <Item messageId={item.id} scrollAnchor={item.scrollAnchor} style="height: {item.height ?? 80}px; flex: none">{item.id}</Item>
        {/each}
      </Content>
    </Viewport>
    <Button behavior="auto">Scroll to end</Button>
    <Probe jumpTo={params.get('jump') ?? undefined} visibility={params.has('visibility')} />
  </Root>
</Provider>
