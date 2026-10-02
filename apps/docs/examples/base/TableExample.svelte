<script lang="ts">
  // Derived from shadcn-ui/ui d75a96ab781f3d659be1ad287347d5887ce9f2fc; MIT notice in tests/reference/LICENSE.
  import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@sveltery/ui/table';
  const invoices = [
    { invoice: 'INV001', paymentStatus: 'Paid', totalAmount: '$250.00', paymentMethod: 'Credit Card' },
    { invoice: 'INV002', paymentStatus: 'Pending', totalAmount: '$150.00', paymentMethod: 'PayPal' },
    { invoice: 'INV003', paymentStatus: 'Unpaid', totalAmount: '$350.00', paymentMethod: 'Bank Transfer' },
    { invoice: 'INV004', paymentStatus: 'Paid', totalAmount: '$450.00', paymentMethod: 'Credit Card' },
    { invoice: 'INV005', paymentStatus: 'Paid', totalAmount: '$550.00', paymentMethod: 'PayPal' },
    { invoice: 'INV006', paymentStatus: 'Pending', totalAmount: '$200.00', paymentMethod: 'Bank Transfer' },
    { invoice: 'INV007', paymentStatus: 'Unpaid', totalAmount: '$300.00', paymentMethod: 'Credit Card' },
  ];
</script>

<!-- Three pinned examples; native sections/headings substitute for out-of-scope Example/ExampleWrapper. -->
<section data-gallery class="grid gap-6">
  <section>
    <h2>Basic</h2>
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each invoices.slice(0, 3) as invoice (invoice.invoice)}
          <TableRow>
            <TableCell class="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell class="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </section>
  <section>
    <h2>With Footer</h2>
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each invoices.slice(0, 3) as invoice (invoice.invoice)}
          <TableRow>
            <TableCell class="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell class="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colspan={3}>Total</TableCell>
          <TableCell class="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </section>
  <section>
    <h2>Simple</h2>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead class="text-right">Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell class="font-medium">Sarah Chen</TableCell>
          <TableCell>sarah.chen@acme.com</TableCell>
          <TableCell class="text-right">Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="font-medium">Marc Rodriguez</TableCell>
          <TableCell>marcus.rodriguez@acme.com</TableCell>
          <TableCell class="text-right">User</TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="font-medium">Emily Watson</TableCell>
          <TableCell>emily.watson@acme.com</TableCell>
          <TableCell class="text-right">User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </section>
</section>
