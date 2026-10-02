<script lang="ts">
  // Source-derived acceptance probe; compositions with other UI controls remain deferred.
  import { onMount, untrack } from 'svelte';
  import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from '@sveltery/ui/table';
  type Part = 'table' | 'header' | 'body' | 'footer' | 'row' | 'head' | 'cell' | 'caption';
  let hydrated = $state(false);
  let changed = $state(false);
  let show = $state(true);
  let clicks = $state(0);
  let replaced = $state(false);
  let table = $state<HTMLTableElement | null>();
  let header = $state<HTMLTableSectionElement | null>();
  let body = $state<HTMLTableSectionElement | null>();
  let footer = $state<HTMLTableSectionElement | null>();
  let row = $state<HTMLTableRowElement | null>();
  let head = $state<HTMLTableCellElement | null>();
  let cell = $state<HTMLTableCellElement | null>();
  let caption = $state<HTMLTableCaptionElement | null>();
  let attachments = $state<Partial<Record<Part, number>>>({});
  let cleanups = $state<Partial<Record<Part, number>>>({});
  const parts: Part[] = ['table', 'header', 'body', 'footer', 'row', 'head', 'cell', 'caption'];
  function attachmentSet() { return Object.fromEntries(parts.map(part => [part, (node: HTMLElement) => {
    untrack(() => { attachments[part] = (attachments[part] ?? 0) + 1; });
    node.dataset.probed = part;
    return () => untrack(() => { cleanups[part] = (cleanups[part] ?? 0) + 1; });
  }])) as Record<Part, (node: HTMLElement) => () => void>; }
  const initialAttachments = attachmentSet();
  const replacementAttachments = attachmentSet();
  const attach = $derived(replaced ? replacementAttachments : initialAttachments);
  const tags = $derived(Object.fromEntries(Object.entries({ table, header, body, footer, row, head, cell, caption }).map(([part, node]) => [part, node === undefined ? 'undefined' : node?.tagName ?? null])));
  onMount(() => { hydrated = true; });
</script>
<main data-table-probe data-hydrated={hydrated} class="p-8">
  <h1>Native Table acceptance probe</h1>
  <section data-testid="overflow-host" class="w-full max-w-2xl">
    {#if show}
      <Table id="probe-table" data-testid="probe-table" data-slot={changed ? 'table-override' : 'table'} class={['min-w-[900px]', { 'text-base': changed }]} bind:ref={table} {@attach attach.table}>
        <TableCaption id="probe-caption" bind:ref={caption} {@attach attach.caption}>{changed ? 'Updated ledger' : 'Quarterly ledger'}</TableCaption>
        <TableHeader bind:ref={header} {@attach attach.header}>
          <TableRow>
            <TableHead id="probe-head" scope="col" colspan={changed ? 2 : 1} class={changed ? 'px-6 text-right' : undefined} bind:ref={head} {@attach attach.head}>Account</TableHead>
            <TableHead scope="col">Amount</TableHead><TableHead scope="col" data-testid="checkbox-head">
              <!-- svelte-ignore a11y_no_redundant_roles (Pinned Table selector explicitly requires role=checkbox) -->
              <input type="checkbox" role="checkbox" aria-label="Select all invoices" />Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody bind:ref={body} {@attach attach.body}>
          <TableRow id="probe-row" data-state={changed ? 'selected' : undefined} data-custom={changed ? 'updated' : 'initial'} bind:ref={row} {@attach attach.row} onclick={() => clicks++}>
            <TableCell id="probe-cell" headers="probe-head" rowspan={changed ? 2 : 1} class={changed ? 'px-6' : undefined} bind:ref={cell} {@attach attach.cell}>INV001</TableCell>
            <TableCell>$250.00</TableCell><TableCell>Paid</TableCell>
          </TableRow>
          <TableRow data-testid="selected-row" data-state="selected"><TableCell>Selected</TableCell><TableCell>$150.00</TableCell><TableCell>Paid</TableCell></TableRow>
          <TableRow data-testid="expanded-row"><TableCell><button type="button" aria-expanded={changed}>Details</button></TableCell><TableCell>$350.00</TableCell><TableCell>Pending</TableCell></TableRow>
          <TableRow data-testid="checkbox-row">
            <TableCell data-testid="checkbox-cell">
              <!-- svelte-ignore a11y_no_redundant_roles (Pinned Table selector explicitly requires role=checkbox) -->
              <input type="checkbox" role="checkbox" aria-label="Select invoice" />
            </TableCell><TableCell>$50.00</TableCell><TableCell>Unpaid</TableCell>
          </TableRow>
          <TableRow data-testid="hover-row"><TableCell>Hover</TableCell><TableCell>$75.00</TableCell><TableCell>Paid</TableCell></TableRow>
        </TableBody>
        <TableFooter bind:ref={footer} {@attach attach.footer}><TableRow><TableCell colspan={2}>Total</TableCell><TableCell>$875.00</TableCell></TableRow></TableFooter>
      </Table>
    {/if}
  </section>
  <button type="button" onclick={() => changed = !changed}>Update table</button>
  <button type="button" onclick={() => show = !show}>{show ? 'Remove table' : 'Restore table'}</button>
  <button type="button" onclick={() => replaced = !replaced}>Swap attachments</button>
  <output data-testid="probe-state">{JSON.stringify({ changed, clicks, replaced, tags, attachments, cleanups })}</output>
</main>
