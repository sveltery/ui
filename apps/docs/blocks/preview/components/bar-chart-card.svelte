<script lang="ts">
  import { Bar, BarChart, CartesianGrid, XAxis, type SvelteArgs, type LegendContentProps } from '@sveltery/charts';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, type TooltipContentArgs } from '$registry/bases/base/ui/chart';

  const barChartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]

  const barChartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const desktopTotal = barChartData.reduce((sum, item) => sum + item.desktop, 0)

  const mobileTotal = barChartData.reduce((sum, item) => sum + item.mobile, 0)

  const desktopDelta = Math.round(
    ((desktopTotal - mobileTotal) / mobileTotal) * 100
  )

  const desktopDeltaPrefix = desktopDelta > 0 ? "+" : ""
</script>

<Card>
  <CardHeader>
    <CardTitle class="text-lg">Traffic channels</CardTitle>
    <CardDescription class="line-clamp-2 text-sm leading-snug">Monthly desktop and mobile traffic for the last six months—compare volume and mix across platforms and devices at a glance.</CardDescription>
  </CardHeader>
  <CardContent class="flex flex-col gap-4 pt-0">
    <ChartContainer config={barChartConfig} class="max-h-[180px] w-full">
      <BarChart accessibilityLayer data={barChartData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} tickFormatter={(value) => String(value).slice(0, 3)} />
        <ChartTooltip cursor={false}>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent indicator="dashed" {...props} />
          {/snippet}
        </ChartTooltip>
        <ChartLegend>
          {#snippet content(props: SvelteArgs<LegendContentProps>)}
            <ChartLegendContent {...props} />
          {/snippet}
        </ChartLegend>
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
    <div class="grid w-full grid-cols-3 divide-x divide-border/60">
      <div class="px-2 text-center">
        <div class="text-[0.65rem] text-muted-foreground uppercase">Desktop</div>
        <div class="text-sm font-medium tabular-nums">{desktopTotal.toLocaleString()}</div>
      </div>
      <div class="px-2 text-center">
        <div class="text-[0.65rem] text-muted-foreground uppercase">Mobile</div>
        <div class="text-sm font-medium tabular-nums">{mobileTotal.toLocaleString()}</div>
      </div>
      <div class="px-2 text-center">
        <div class="text-[0.65rem] text-muted-foreground uppercase">Mix Delta</div>
        <div class="text-sm font-medium tabular-nums">{desktopDeltaPrefix}{desktopDelta}%</div>
      </div>
    </div>
  </CardContent>
  <CardFooter>
    <Button class="w-full">View report</Button>
  </CardFooter>
</Card>
