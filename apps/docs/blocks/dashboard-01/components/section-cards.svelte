<script lang="ts">
  import { Badge } from '@sveltery/components/badge';
  import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { IconPlaceholder } from '@sveltery/components/icons';
</script>

{#snippet trendingUp(className?: string)}
  <IconPlaceholder lucide="TrendingUpIcon" tabler="IconTrendingUp" hugeicons="ChartUpIcon" phosphor="TrendUpIcon" remixicon="RiArrowUpLine" class={className} />
{/snippet}

{#snippet trendingDown(className?: string)}
  <IconPlaceholder lucide="TrendingDownIcon" tabler="IconTrendingDown" hugeicons="ChartDownIcon" phosphor="TrendDownIcon" remixicon="RiArrowDownLine" class={className} />
{/snippet}

<div class="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
  <Card class="@container/card">
    <CardHeader>
      <CardDescription>Total Revenue</CardDescription>
      <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</CardTitle>
      <CardAction>
        <Badge variant="outline">
          {@render trendingUp()}
          +12.5%
        </Badge>
      </CardAction>
    </CardHeader>
    <CardFooter class="flex-col items-start gap-1.5 text-sm">
      <div class="line-clamp-1 flex gap-2 font-medium">
        Trending up this month {@render trendingUp('size-4')}
      </div>
      <div class="text-muted-foreground">Visitors for the last 6 months</div>
    </CardFooter>
  </Card>
  <Card class="@container/card">
    <CardHeader>
      <CardDescription>New Customers</CardDescription>
      <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">1,234</CardTitle>
      <CardAction>
        <Badge variant="outline">
          {@render trendingDown()}
          -20%
        </Badge>
      </CardAction>
    </CardHeader>
    <CardFooter class="flex-col items-start gap-1.5 text-sm">
      <div class="line-clamp-1 flex gap-2 font-medium">
        Down 20% this period {@render trendingDown('size-4')}
      </div>
      <div class="text-muted-foreground">Acquisition needs attention</div>
    </CardFooter>
  </Card>
  <Card class="@container/card">
    <CardHeader>
      <CardDescription>Active Accounts</CardDescription>
      <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">45,678</CardTitle>
      <CardAction>
        <Badge variant="outline">
          {@render trendingUp()}
          +12.5%
        </Badge>
      </CardAction>
    </CardHeader>
    <CardFooter class="flex-col items-start gap-1.5 text-sm">
      <div class="line-clamp-1 flex gap-2 font-medium">
        Strong user retention {@render trendingUp('size-4')}
      </div>
      <div class="text-muted-foreground">Engagement exceed targets</div>
    </CardFooter>
  </Card>
  <Card class="@container/card">
    <CardHeader>
      <CardDescription>Growth Rate</CardDescription>
      <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">4.5%</CardTitle>
      <CardAction>
        <Badge variant="outline">
          {@render trendingUp()}
          +4.5%
        </Badge>
      </CardAction>
    </CardHeader>
    <CardFooter class="flex-col items-start gap-1.5 text-sm">
      <div class="line-clamp-1 flex gap-2 font-medium">
        Steady performance increase {@render trendingUp('size-4')}
      </div>
      <div class="text-muted-foreground">Meets growth projections</div>
    </CardFooter>
  </Card>
</div>
