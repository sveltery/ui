<script lang="ts">
  import { Cancel01Icon } from '@hugeicons/core-free-icons';
  import { HugeiconsIcon } from '@hugeicons/svelte';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '$registry/bases/base/ui/item';

  const HOLDINGS = [
    {
      name: 'Dividend Fund',
      shares: '450 Shares',
      amount: '$1,842.10',
      data: [
        { q: 'Q1', value: 380 },
        { q: 'Q2', value: 420 },
        { q: 'Q3', value: 390 },
        { q: 'Q4', value: 652 }
      ]
    },
    {
      name: 'Market Index IDX',
      shares: '112 Shares',
      amount: '$928.40',
      data: [
        { q: 'Q1', value: 180 },
        { q: 'Q2', value: 210 },
        { q: 'Q3', value: 320 },
        { q: 'Q4', value: 218 }
      ]
    },
    {
      name: 'Consumer Tech CTK',
      shares: '85 Shares',
      amount: '$340.00',
      data: [
        { q: 'Q1', value: 60 },
        { q: 'Q2', value: 70 },
        { q: 'Q3', value: 120 },
        { q: 'Q4', value: 90 }
      ]
    },
    {
      name: 'Realty Trust',
      shares: '320 Shares',
      amount: '$1,139.50',
      data: [
        { q: 'Q1', value: 240 },
        { q: 'Q2', value: 260 },
        { q: 'Q3', value: 280 },
        { q: 'Q4', value: 360 }
      ]
    }
  ];
</script>

<Card>
  <CardHeader>
    <CardTitle>Q2 Dividend Income</CardTitle>
    <CardDescription>Quarterly dividend payouts across your portfolio holdings.</CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon-sm" class="bg-muted" aria-label="Dismiss dividend income">
        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <ItemGroup>
      {#each HOLDINGS as holding (holding.name)}
        {@const peak = Math.max(...holding.data.map((point) => point.value))}
        <Item role="listitem" variant="muted">
          <ItemContent>
            <ItemTitle>{holding.name}</ItemTitle>
            <ItemDescription>{holding.shares}</ItemDescription>
          </ItemContent>
          <div class="hidden h-8 w-24 items-end gap-1 md:flex" role="img" aria-label="{holding.name} quarterly dividends">
            {#each holding.data as item (item.q)}
              <div class="min-h-1 flex-1 rounded-t-sm bg-chart-2" style="height: {(item.value / peak) * 100}%"></div>
            {/each}
          </div>
        </Item>
      {/each}
    </ItemGroup>
  </CardContent>
</Card>
