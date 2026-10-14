<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { Table, TableBody, TableCell, TableRow } from '@sveltery/ui/table';
  import { IconPlaceholder } from '@sveltery/ui/icons';
</script>

<Card>
  <CardHeader>
    <CardTitle>Recent Transactions</CardTitle>
    <CardDescription>Your latest account activity.</CardDescription>
    <CardAction>
      <Button variant="outline" size="sm">View All</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell class="w-10">
            <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
              <IconPlaceholder class="size-4 shrink-0" lucide="CoffeeIcon" tabler="IconCoffee" hugeicons="CoffeeIcon" phosphor="CoffeeIcon" remixicon="RiCupLine" />
            </div>
          </TableCell>
          <TableCell>
            <div class="flex flex-col">
              <span class="font-medium">Blue Bottle Coffee</span>
              <span class="text-sm text-muted-foreground">Food & Drink</span>
            </div>
          </TableCell>
          <TableCell class="text-sm text-muted-foreground">Today, 10:24 AM</TableCell>
          <TableCell class="text-right">
            <span class="text-sm font-semibold tabular-nums">-$6.50</span>
          </TableCell>
          <TableCell class="w-8">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {#snippet render(props, _state, content)}
                  <Button {...(props as Record<string, unknown>)} variant="ghost" size="icon-sm">{@render content?.()}</Button>
                {/snippet}
                <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDotsVertical" hugeicons="MoreVerticalCircle01Icon" phosphor="DotsThreeIcon" remixicon="RiMore2Line" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Add note</DropdownMenuItem>
                <DropdownMenuItem>Categorize</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dispute</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="w-10">
            <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
              <IconPlaceholder class="size-4 shrink-0" lucide="ShoppingCartIcon" tabler="IconShoppingCart" hugeicons="ShoppingCart01Icon" phosphor="ShoppingCartIcon" remixicon="RiShoppingCartLine" />
            </div>
          </TableCell>
          <TableCell>
            <div class="flex flex-col">
              <span class="font-medium">Whole Foods Market</span>
              <span class="text-sm text-muted-foreground">Groceries</span>
            </div>
          </TableCell>
          <TableCell class="text-sm text-muted-foreground">Yesterday</TableCell>
          <TableCell class="text-right">
            <span class="text-sm font-semibold tabular-nums">-$142.30</span>
          </TableCell>
          <TableCell class="w-8">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {#snippet render(props, _state, content)}
                  <Button {...(props as Record<string, unknown>)} variant="ghost" size="icon-sm">{@render content?.()}</Button>
                {/snippet}
                <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDotsVertical" hugeicons="MoreVerticalCircle01Icon" phosphor="DotsThreeIcon" remixicon="RiMore2Line" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Add note</DropdownMenuItem>
                <DropdownMenuItem>Categorize</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dispute</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="w-10">
            <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
              <IconPlaceholder class="size-4 shrink-0" lucide="WalletIcon" tabler="IconWallet" hugeicons="Wallet01Icon" phosphor="WalletIcon" remixicon="RiWalletLine" />
            </div>
          </TableCell>
          <TableCell>
            <div class="flex flex-col">
              <span class="font-medium">Stripe Payout</span>
              <span class="text-sm text-muted-foreground">Income</span>
            </div>
          </TableCell>
          <TableCell class="text-sm text-muted-foreground">Oct 12</TableCell>
          <TableCell class="text-right">
            <span class="text-sm font-semibold text-emerald-500 tabular-nums">+$4,200.00</span>
          </TableCell>
          <TableCell class="w-8">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {#snippet render(props, _state, content)}
                  <Button {...(props as Record<string, unknown>)} variant="ghost" size="icon-sm">{@render content?.()}</Button>
                {/snippet}
                <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDotsVertical" hugeicons="MoreVerticalCircle01Icon" phosphor="DotsThreeIcon" remixicon="RiMore2Line" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Add note</DropdownMenuItem>
                <DropdownMenuItem>Categorize</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dispute</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="w-10">
            <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
              <IconPlaceholder class="size-4 shrink-0" lucide="CarIcon" tabler="IconCar" hugeicons="Car01Icon" phosphor="CarIcon" remixicon="RiCarLine" />
            </div>
          </TableCell>
          <TableCell>
            <div class="flex flex-col">
              <span class="font-medium">Uber Technologies</span>
              <span class="text-sm text-muted-foreground">Transport</span>
            </div>
          </TableCell>
          <TableCell class="text-sm text-muted-foreground">Oct 11</TableCell>
          <TableCell class="text-right">
            <span class="text-sm font-semibold tabular-nums">-$24.10</span>
          </TableCell>
          <TableCell class="w-8">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {#snippet render(props, _state, content)}
                  <Button {...(props as Record<string, unknown>)} variant="ghost" size="icon-sm">{@render content?.()}</Button>
                {/snippet}
                <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDotsVertical" hugeicons="MoreVerticalCircle01Icon" phosphor="DotsThreeIcon" remixicon="RiMore2Line" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Add note</DropdownMenuItem>
                <DropdownMenuItem>Categorize</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dispute</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="w-10">
            <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
              <IconPlaceholder class="size-4 shrink-0" lucide="TvIcon" tabler="IconDeviceTv" hugeicons="Tv01Icon" phosphor="TelevisionIcon" remixicon="RiTvLine" />
            </div>
          </TableCell>
          <TableCell>
            <div class="flex flex-col">
              <span class="font-medium">Netflix Subscription</span>
              <span class="text-sm text-muted-foreground">Entertainment</span>
            </div>
          </TableCell>
          <TableCell class="text-sm text-muted-foreground">Oct 10</TableCell>
          <TableCell class="text-right">
            <span class="text-sm font-semibold tabular-nums">-$19.99</span>
          </TableCell>
          <TableCell class="w-8">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {#snippet render(props, _state, content)}
                  <Button {...(props as Record<string, unknown>)} variant="ghost" size="icon-sm">{@render content?.()}</Button>
                {/snippet}
                <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDotsVertical" hugeicons="MoreVerticalCircle01Icon" phosphor="DotsThreeIcon" remixicon="RiMore2Line" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Add note</DropdownMenuItem>
                <DropdownMenuItem>Categorize</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dispute</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>
