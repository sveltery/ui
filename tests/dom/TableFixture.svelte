<script lang="ts">
  import { untrack } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import * as UI from '../../apps/docs/registry/bases/base/ui/table/index.js';
  let { initializeNull = false }: { initializeNull?: boolean } = $props();
  let table = $state<HTMLTableElement | null | undefined>(untrack(() => initializeNull ? null : undefined));
  let header = $state<HTMLTableSectionElement | null | undefined>(untrack(() => initializeNull ? null : undefined));
  let body = $state<HTMLTableSectionElement | null | undefined>(untrack(() => initializeNull ? null : undefined));
  let footer = $state<HTMLTableSectionElement | null | undefined>(untrack(() => initializeNull ? null : undefined));
  let row = $state<HTMLTableRowElement | null | undefined>(untrack(() => initializeNull ? null : undefined));
  let head = $state<HTMLTableCellElement | null | undefined>(untrack(() => initializeNull ? null : undefined));
  let cell = $state<HTMLTableCellElement | null | undefined>(untrack(() => initializeNull ? null : undefined));
  let caption = $state<HTMLTableCaptionElement | null | undefined>(untrack(() => initializeNull ? null : undefined));
  let visible = $state(true);
  let changed = $state(false);
  let attached = 0;
  let detached = 0;
  const calls: string[] = [];
  const nodes: HTMLElement[] = [];
  const attachment = { [createAttachmentKey()]: (node: HTMLElement) => { attached++; nodes.push(node); return () => { detached++; }; } };
  const common = $derived({ class: changed ? 'px-6 font-bold' : 'px-2', title: changed ? 'Updated' : 'Initial', 'data-slot': changed ? 'consumer-updated' : 'consumer-initial', onclick: (event: MouseEvent & { currentTarget: EventTarget & HTMLElement }) => calls.push(`click:${event.currentTarget.tagName}`), onkeydown: (event: KeyboardEvent & { currentTarget: EventTarget & HTMLElement }) => calls.push(`key:${event.currentTarget.tagName}:${event.key}`) });
  export function snapshot() { return { refs: { table, header, body, footer, row, head, cell, caption }, attached, detached, nodes, calls }; }
  export function update() { changed = true; }
  export function hide() { visible = false; }
  export function show() { visible = true; }
</script>
{#if visible}
  <UI.Table id="native-table" {...common} {...attachment} bind:ref={table}>
    <UI.TableCaption id="native-caption" {...common} {...attachment} bind:ref={caption}>{changed ? 'Updated caption' : 'Initial caption'}</UI.TableCaption>
    <UI.TableHeader id="native-header" {...common} {...attachment} bind:ref={header}>
      <UI.TableRow><UI.TableHead id="native-head" {...common} {...attachment} bind:ref={head} scope="col" colspan={changed ? 3 : 2} rowspan={changed ? 2 : 1}>Invoice</UI.TableHead></UI.TableRow>
    </UI.TableHeader>
    <UI.TableBody id="native-body" {...common} {...attachment} bind:ref={() => body, next => { body = next; }}>
      <UI.TableRow id="native-row" {...common} {...attachment} bind:ref={row} data-state={changed ? 'selected' : undefined}>
        <UI.TableCell id="native-cell" {...common} {...attachment} bind:ref={cell} headers="native-head" colspan={changed ? 3 : 2} rowspan={changed ? 2 : 1}>{changed ? 'Updated invoice' : 'Initial invoice'}</UI.TableCell>
      </UI.TableRow>
    </UI.TableBody>
    <UI.TableFooter id="native-footer" {...common} {...attachment} bind:ref={footer}><UI.TableRow><UI.TableCell>Total</UI.TableCell></UI.TableRow></UI.TableFooter>
  </UI.Table>
{/if}
