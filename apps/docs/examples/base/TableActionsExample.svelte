<script lang="ts">
  import MoreHorizontalIcon from '@lucide/svelte/icons/ellipsis';
  import { Button } from '$registry/bases/base/ui/button';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$registry/bases/base/ui/table';

  const products = [
    { name: 'Wireless Mouse', price: '$29.99' },
    { name: 'Mechanical Keyboard', price: '$129.99' },
    { name: 'USB-C Hub', price: '$49.99' }
  ];
</script>

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
              <MoreHorizontalIcon />
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
