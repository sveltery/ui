<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Button } from '@sveltery/ui/button';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Input } from '@sveltery/ui/input';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/ui/select';
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
  const products = [
    { name: 'Wireless Mouse', price: '$29.99' },
    { name: 'Mechanical Keyboard', price: '$129.99' },
    { name: 'USB-C Hub', price: '$49.99' },
  ];
  const people = [
    { value: 'sarah', label: 'Sarah Chen' },
    { value: 'marcus', label: 'Marc Rodriguez' },
    { value: 'emily', label: 'Emily Watson' },
    { value: 'david', label: 'David Kim' },
  ];
  const tasks = [
    { task: 'Design homepage', assignee: 'sarah', status: 'In Progress' },
    { task: 'Implement API', assignee: 'marcus', status: 'Pending' },
    { task: 'Write tests', assignee: 'emily', status: 'Not Started' },
  ];
</script>

<ExampleWrapper>
  <Example title="Basic">
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
  </Example>
  <Example title="With Footer">
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
  </Example>
  <Example title="Simple">
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
  </Example>
  <Example title="With Badges">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="text-right">Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell class="font-medium">Design homepage</TableCell>
          <TableCell>
            <span class="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">Completed</span>
          </TableCell>
          <TableCell class="text-right">
            <span class="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">High</span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="font-medium">Implement API</TableCell>
          <TableCell>
            <span class="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-400">In Progress</span>
          </TableCell>
          <TableCell class="text-right">
            <span class="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-400">Medium</span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="font-medium">Write tests</TableCell>
          <TableCell>
            <span class="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-400">Pending</span>
          </TableCell>
          <TableCell class="text-right">
            <span class="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-400">Low</span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Example>
  <Example title="With Actions">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each products as product (product.name)}
          <TableRow>
            <TableCell class="font-medium">{product.name}</TableCell>
            <TableCell>{product.price}</TableCell>
            <TableCell class="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {#snippet render(props, _state, content)}<Button variant="ghost" size="icon" class="size-8" {...props}>{@render content?.()}</Button>{/snippet}
                  <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDots" hugeicons="MoreHorizontalCircle01Icon" phosphor="DotsThreeOutlineIcon" remixicon="RiMoreLine" />
                  <span class="sr-only">Open menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </Example>
  <Example title="With Select">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each tasks as item (item.task)}
          <TableRow>
            <TableCell class="font-medium">{item.task}</TableCell>
            <TableCell>
              <Select items={people} defaultValue={people.find((person) => person.value === item.assignee)} itemToStringValue={(person: (typeof people)[number]) => person.value}>
                <SelectTrigger class="w-40" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {#each people as person (person.value)}
                      <SelectItem value={person}>{person.label}</SelectItem>
                    {/each}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </Example>
  <Example title="With Input">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell class="font-medium">Wireless Mouse</TableCell>
          <TableCell>
            <Input type="number" value="1" class="h-8 w-20" min="0" />
          </TableCell>
          <TableCell>$29.99</TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="font-medium">Mechanical Keyboard</TableCell>
          <TableCell>
            <Input type="number" value="2" class="h-8 w-20" min="0" />
          </TableCell>
          <TableCell>$129.99</TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="font-medium">USB-C Hub</TableCell>
          <TableCell>
            <Input type="number" value="1" class="h-8 w-20" min="0" />
          </TableCell>
          <TableCell>$49.99</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Example>
</ExampleWrapper>
