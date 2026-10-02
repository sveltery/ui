// Source-derived acceptance harness executing byte-exact Table wrappers; not an upstream test port.
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from './table';
export function TableProbe() {
  const [hydrated, setHydrated] = useState(false);
  const [changed, setChanged] = useState(false);
  const [show, setShow] = useState(true);
  const [clicks, setClicks] = useState(0);
  useEffect(() => setHydrated(true), []);
  return <main data-table-probe data-hydrated={hydrated} className="p-8">
    <h1>Native Table acceptance probe</h1>
    <section data-testid="overflow-host" className="w-full max-w-2xl">
      {show && <Table id="probe-table" data-testid="probe-table" data-slot={changed ? 'table-override' : 'table'} className={['min-w-[900px]', changed ? 'text-base' : ''].join(' ')}>
        <TableCaption id="probe-caption">{changed ? 'Updated ledger' : 'Quarterly ledger'}</TableCaption>
        <TableHeader><TableRow><TableHead id="probe-head" scope="col" colSpan={changed ? 2 : 1} className={changed ? 'px-6 text-right' : undefined}>Account</TableHead><TableHead scope="col">Amount</TableHead><TableHead scope="col" data-testid="checkbox-head"><input type="checkbox" role="checkbox" aria-label="Select all invoices" />Status</TableHead></TableRow></TableHeader>
        <TableBody>
          <TableRow id="probe-row" data-state={changed ? 'selected' : undefined} data-custom={changed ? 'updated' : 'initial'} onClick={() => setClicks(clicks + 1)}><TableCell id="probe-cell" headers="probe-head" rowSpan={changed ? 2 : 1} className={changed ? 'px-6' : undefined}>INV001</TableCell><TableCell>$250.00</TableCell><TableCell>Paid</TableCell></TableRow>
          <TableRow data-testid="selected-row" data-state="selected"><TableCell>Selected</TableCell><TableCell>$150.00</TableCell><TableCell>Paid</TableCell></TableRow>
          <TableRow data-testid="expanded-row"><TableCell><button type="button" aria-expanded={changed}>Details</button></TableCell><TableCell>$350.00</TableCell><TableCell>Pending</TableCell></TableRow>
          <TableRow data-testid="checkbox-row"><TableCell data-testid="checkbox-cell"><input type="checkbox" role="checkbox" aria-label="Select invoice" /></TableCell><TableCell>$50.00</TableCell><TableCell>Unpaid</TableCell></TableRow>
          <TableRow data-testid="hover-row"><TableCell>Hover</TableCell><TableCell>$75.00</TableCell><TableCell>Paid</TableCell></TableRow>
        </TableBody>
        <TableFooter><TableRow><TableCell colSpan={2}>Total</TableCell><TableCell>$875.00</TableCell></TableRow></TableFooter>
      </Table>}
    </section>
    <button type="button" onClick={() => setChanged(!changed)}>Update table</button>
    <button type="button" onClick={() => setShow(!show)}>{show ? 'Remove table' : 'Restore table'}</button>
  </main>;
}
