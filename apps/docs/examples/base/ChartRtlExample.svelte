<script lang="ts">
  import { Bar, BarChart, CartesianGrid, XAxis, type LegendContentProps, type SvelteArgs } from '@sveltery/charts';
  import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, type TooltipContentArgs } from '$registry/bases/base/ui/chart';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        desktop: 'Desktop',
        mobile: 'Mobile'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        january: 'يناير',
        february: 'فبراير',
        march: 'مارس',
        april: 'أبريل',
        may: 'مايو',
        june: 'يونيو',
        desktop: 'سطح المكتب',
        mobile: 'الجوال'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        january: 'ינואר',
        february: 'פברואר',
        march: 'מרץ',
        april: 'אפריל',
        may: 'מאי',
        june: 'יוני',
        desktop: 'מחשב',
        mobile: 'נייד'
      }
    }
  } as const;

  const chartData = [
    { month: 'january', desktop: 186, mobile: 80 },
    { month: 'february', desktop: 305, mobile: 200 },
    { month: 'march', desktop: 237, mobile: 120 },
    { month: 'april', desktop: 73, mobile: 190 },
    { month: 'may', desktop: 209, mobile: 130 },
    { month: 'june', desktop: 214, mobile: 140 }
  ];

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);

  const chartConfig = $derived({
    desktop: {
      label: t.desktop,
      color: 'var(--chart-2)'
    },
    mobile: {
      label: t.mobile,
      color: 'var(--chart-1)'
    }
  } satisfies ChartConfig);
</script>

<div class="flex w-full flex-col gap-4">
  <div {dir}>
    <ChartContainer config={chartConfig} class="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} orientation={dir === 'rtl' ? 'right' : 'left'} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => t[value as keyof typeof t].slice(0, 3)}
          reversed={dir === 'rtl'}
        />
        <ChartTooltip labelClassName="w-32">
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent labelFormatter={(value) => t[value as keyof typeof t]} {...props} />
          {/snippet}
        </ChartTooltip>
        <ChartLegend>
          {#snippet content(props: SvelteArgs<LegendContentProps>)}
            <ChartLegendContent {...props} />
          {/snippet}
        </ChartLegend>
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  </div>
</div>
