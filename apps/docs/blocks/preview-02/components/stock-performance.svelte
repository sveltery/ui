<script lang="ts">
  import { scaleUtc } from 'd3-scale';
  import { curveMonotoneX } from 'd3-shape';
  import { Area, AreaChart, LinearGradient } from 'layerchart';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/ui/chart';
  import { Combobox, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@sveltery/ui/combobox';
  import { Field, FieldGroup, FieldLabel } from '@sveltery/ui/field';
  import { Separator } from '@sveltery/ui/separator';

  const TICKERS = ['VOO', 'VIG', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  const CHART_DATA: Record<string, { month: string; price: number }[]> = {
    VOO: [
      { month: 'Jan', price: 412 },
      { month: 'Feb', price: 438 },
      { month: 'Mar', price: 395 },
      { month: 'Apr', price: 450 },
      { month: 'May', price: 420 },
      { month: 'Jun', price: 462 }
    ],
    AAPL: [
      { month: 'Jan', price: 185 },
      { month: 'Feb', price: 210 },
      { month: 'Mar', price: 172 },
      { month: 'Apr', price: 198 },
      { month: 'May', price: 178 },
      { month: 'Jun', price: 215 }
    ]
  }
  const DEFAULT_DATA = [
    { month: 'Jan', price: 100 },
    { month: 'Feb', price: 118 },
    { month: 'Mar', price: 95 },
    { month: 'Apr', price: 125 },
    { month: 'May', price: 108 },
    { month: 'Jun', price: 130 }
  ];
  const chartConfig = {
    price: {
      label: 'Price',
      color: 'var(--chart-1)'
    }
  } satisfies ChartConfig;
  const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  let ticker = $state<string | null>('VOO');
  const data = $derived(
    (CHART_DATA[ticker ?? ''] ?? DEFAULT_DATA).map((row) => ({
      ...row,
      date: new Date(Date.UTC(2024, monthIndex.indexOf(row.month), 1))
    }))
  );
  const longMonth = (value: Date) => value.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
</script>

<Card>
  <CardHeader>
    <CardTitle>Stock Performance</CardTitle>
    <CardDescription>6-month price history.</CardDescription>
  </CardHeader>
  <CardContent class="flex flex-col gap-4">
    <FieldGroup>
      <Field>
        <FieldLabel for="ticker-select">Ticker</FieldLabel>
        <Combobox
          items={TICKERS}
          bind:value={ticker}
        >
          <ComboboxInput id="ticker-select" placeholder="Search ticker..." />
          <ComboboxContent>
            <ComboboxEmpty>No tickers found.</ComboboxEmpty>
            <ComboboxList>
              <ComboboxCollection>
                {#snippet children(item)}
                  <ComboboxItem value={item}>{item}</ComboboxItem>
                {/snippet}
              </ComboboxCollection>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </FieldGroup>
    <Separator class="style-sera:hidden" />
    <ChartContainer aria-label="Price by month" config={chartConfig} class="aspect-auto h-[200px] w-full">
      <AreaChart
        {data}
        x="date"
        xScale={scaleUtc()}
        series={[{ key: 'price', label: 'Price', color: 'var(--color-price)' }]}
        axis={false}
        padding={{ top: 8, left: 0, right: 0, bottom: 0 }}
        props={{ grid: { x: false, class: 'stroke-border/60 [stroke-dasharray:3_3]' } }}
      >
        {#snippet tooltip()}
          <ChartTooltip hideLabel labelFormatter={longMonth} />
        {/snippet}
        {#snippet marks({ context })}
          {#each context.series.visibleSeries as s (s.key)}
            <LinearGradient stops={[`color-mix(in oklab, ${s.color} 30%, transparent)`, `color-mix(in oklab, ${s.color} 5%, transparent)`]} vertical>
              {#snippet children({ gradient })}
                <Area seriesKey={s.key} curve={curveMonotoneX} fill={gradient} line={{ class: 'stroke-2' }} motion="tween" />
              {/snippet}
            </LinearGradient>
          {/each}
        {/snippet}
      </AreaChart>
    </ChartContainer>
  </CardContent>
</Card>
