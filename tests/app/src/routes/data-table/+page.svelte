<script lang="ts">
  import { columns, type Payment } from '$examples/base/data-table/columns';
  import DataTable from '$examples/base/data-table/data-table.svelte';
  import ReusableTable from './reusable-table.svelte';

  let payments = $state<Payment[]>(
    Array.from({ length: 12 }, (_, index) => ({
      id: `payment-${index + 1}`,
      amount: (index + 1) * 10,
      status: index % 2 ? 'success' : 'pending',
      email: `user${String.fromCharCode(108 - index)}@example.com`
    }))
  );
</script>

<section aria-label="Guide" class="p-8">
  <button type="button" onclick={() => (payments = payments.slice(1))}>Remove first payment</button>
  <DataTable {columns} data={payments} />
</section>

<section aria-label="Reusable components" class="p-8">
  <ReusableTable />
</section>
