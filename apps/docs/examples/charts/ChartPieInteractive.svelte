<script lang="ts">
  import { Arc, PieChart, Text } from 'layerchart';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from './layerchart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { NativeSelect, NativeSelectOption } from '$registry/bases/base/ui/native-select';

  const desktopData = [
    { month: 'january', desktop: 186, color: 'var(--color-january)' },
    { month: 'february', desktop: 305, color: 'var(--color-february)' },
    { month: 'march', desktop: 237, color: 'var(--color-march)' },
    { month: 'april', desktop: 173, color: 'var(--color-april)' },
    { month: 'may', desktop: 209, color: 'var(--color-may)' },
  ];

  const chartConfig = {
    desktop: { label: 'Desktop' },
    january: { label: 'January', color: 'var(--chart-1)' },
    february: { label: 'February', color: 'var(--chart-2)' },
    march: { label: 'March', color: 'var(--chart-3)' },
    april: { label: 'April', color: 'var(--chart-4)' },
    may: { label: 'May', color: 'var(--chart-5)' },
  } satisfies ChartConfig;

  let activeMonth = $state(desktopData[0].month);

  const activeIndex = $derived(desktopData.findIndex((item) => item.month === activeMonth));

  const months = $derived(desktopData.map((item) => item.month));
</script>

<Card class="flex w-full max-w-md flex-col">
  <CardHeader class="flex flex-row items-start space-y-0 pb-0">
    <div class="grid gap-1">
      <CardTitle>Pie Chart - Interactive</CardTitle>
      <CardDescription>January - June 2024</CardDescription>
    </div>
    <NativeSelect bind:value={activeMonth} size="sm" class="ms-auto" aria-label="Select a month">
      {#each months as month (month)}
        <NativeSelectOption value={month}>{chartConfig[month as keyof typeof chartConfig].label}</NativeSelectOption>
      {/each}
    </NativeSelect>
  </CardHeader>
  <CardContent class="flex-1">
    <ChartContainer aria-label="Pie Chart - Interactive" config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <PieChart
        data={desktopData}
        label="month"
        key="month"
        value="desktop"
        c="color"
        props={{
          pie: {
            sort: (a, b) => {
              const monthOrder = ['january', 'february', 'march', 'april', 'may'];
              return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
            },
            motion: 'tween',
          },
        }}
        innerRadius={60}
        outerRadius={-35}
        padding={4}
      >
        {#snippet aboveMarks()}
          <Text
            value={desktopData[activeIndex].desktop.toLocaleString()}
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-foreground !text-3xl font-bold"
            dy={3}
          />
          <Text
            value="Visitors"
            textAnchor="middle"
            verticalAnchor="middle"
            class="!fill-muted-foreground text-muted-foreground"
            dy={22}
          />
        {/snippet}
        {#snippet arc({ props, index })}
          {#if index === activeIndex}
            <Arc {...props} outerRadius={-25} />
            <Arc {...props} outerRadius={-10} innerRadius={-13} />
          {:else}
            <Arc {...props} />
          {/if}
        {/snippet}
        {#snippet tooltip()}
          <ChartTooltip hideLabel nameKey="month" />
        {/snippet}
      </PieChart>
    </ChartContainer>
  </CardContent>
  <CardFooter class="flex-col gap-2 text-sm">
    <div class="flex items-center gap-2 leading-none font-medium">
      Trending up by 5.2% this month <IconPlaceholder
        lucide="TrendingUpIcon"
        tabler="IconTrendingUp"
        hugeicons="TradeUpIcon"
        phosphor="TrendUpIcon"
        remixicon="RiLineChartLine"
        class="size-4"
      />
    </div>
    <div class="text-muted-foreground leading-none">
      Showing total visitors for the last 6 months
    </div>
  </CardFooter>
</Card>
