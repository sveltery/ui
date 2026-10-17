import { createColumnHelper, renderComponent, renderSnippet } from '@tanstack/svelte-table';
import { createRawSnippet } from 'svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableAmount from './data-table-amount.svelte';
import DataTableCheckbox from './data-table-checkbox.svelte';
import DataTableEmailButton from './data-table-email-button.svelte';
import type { DataTableFeatures } from './data-table-features';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const amountHeader = createRawSnippet(() => ({
  render: () => `<div class="text-right">Amount</div>`
}));

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Payment>();

export const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) =>
      renderComponent(DataTableCheckbox, {
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      renderComponent(DataTableCheckbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(value),
        'aria-label': 'Select row'
      }),
    enableSorting: false,
    enableHiding: false
  }),
  columnHelper.accessor('status', {
    header: 'Status'
  }),
  columnHelper.accessor('email', {
    header: ({ column }) =>
      renderComponent(DataTableEmailButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
  }),
  columnHelper.accessor('amount', {
    header: () => renderSnippet(amountHeader),
    cell: ({ row }) => renderComponent(DataTableAmount, { amount: row.original.amount })
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id })
  })
]);
