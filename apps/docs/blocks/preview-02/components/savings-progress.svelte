<script lang="ts">
  import { PieChart, Text } from 'layerchart';
  import { Card, CardContent, CardFooter } from '@sveltery/components/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/components/chart';
  import { Separator } from '@sveltery/components/separator';

  const chartData = [
    { name: 'saved', value: 24000, color: 'var(--color-saved)' },
    { name: 'remaining', value: 6000, color: 'var(--color-remaining)' }
  ];
  const chartConfig = {
    saved: {
      label: 'Saved',
      color: 'var(--chart-2)'
    },
    remaining: {
      label: 'Remaining',
      color: 'var(--chart-1)'
    }
  } satisfies ChartConfig;
</script>

<Card>
  <CardContent>
    <ChartContainer aria-label="Savings progress" config={chartConfig} class="mx-auto aspect-square max-h-[220px]">
      <PieChart
        data={chartData}
        key="name"
        value="value"
        c="color"
        innerRadius={70}
        outerRadius={95}
        range={[90, -270]}
        padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
        props={{ pie: { motion: 'tween' }, arc: { strokeWidth: 0 } }}
      >
        {#snippet aboveMarks()}
          <Text value="$24,000" textAnchor="middle" verticalAnchor="middle" class="fill-foreground text-2xl! font-bold" dy={-12} />
          <Text value="80% of $30,000" textAnchor="middle" verticalAnchor="middle" class="fill-muted-foreground! text-xs text-muted-foreground" dy={12} />
        {/snippet}
        {#snippet tooltip()}
          <ChartTooltip hideLabel nameKey="name" />
        {/snippet}
      </PieChart>
    </ChartContainer>
  </CardContent>
  <CardFooter class="flex-col gap-0">
    <div class="flex w-full items-center justify-between py-3">
      <span class="text-sm text-muted-foreground">Projected Finish</span>
      <span class="text-sm font-semibold">October 2024</span>
    </div>
    <Separator />
    <div class="flex w-full items-center justify-between py-3">
      <span class="text-sm text-muted-foreground">Monthly Average</span>
      <span class="text-sm font-semibold tabular-nums">$1,250</span>
    </div>
    <Separator />
    <div class="flex w-full items-center justify-between py-3">
      <span class="text-sm text-muted-foreground">Top Contributor</span>
      <span class="text-sm font-semibold">Auto-Transfer</span>
    </div>
  </CardFooter>
</Card>
