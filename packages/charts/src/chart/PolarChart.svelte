<script lang="ts">
  import { omit } from 'es-toolkit';
  import { untrack } from 'svelte';
  import type { ChartOptions } from '../state/optionsSlice.js';
  import type { PolarChartProps } from '../util/types.js';
  import { rechartsProps, type RechartsBag, type SvelteProps } from '../util/svelteProps.js';
  import RechartsStoreProvider from '../state/RechartsStoreProvider.svelte';
  import ChartDataContextProvider from '../context/ChartDataContextProvider.svelte';
  import ReportMainChartProps from '../state/ReportMainChartProps.svelte';
  import ReportChartProps from '../state/ReportChartProps.svelte';
  import ReportEventSettings from '../state/ReportEventSettings.svelte';
  import ReportPolarOptions from '../state/ReportPolarOptions.svelte';
  import { defaultPolarChartProps, type PolarChartOptions } from './PolarChart.js';
  import CategoricalChart from './CategoricalChart.svelte';

  type Props = Omit<PolarChartOptions, 'categoricalChartProps'> & {
    categoricalChartProps: SvelteProps<PolarChartOptions['categoricalChartProps']>;
    ref?: SVGSVGElement | null;
  };

  let { chartName, defaultTooltipEventType, validateTooltipEventTypes, tooltipPayloadSearcher, categoricalChartProps, ref = $bindable(null) }: Props = $props();

  const polarChartProps = rechartsProps<PolarChartOptions['categoricalChartProps'], typeof defaultPolarChartProps>(() => categoricalChartProps, defaultPolarChartProps);
  // These options are fixed for the chart's lifetime, like the store they seed.
  const options: ChartOptions = untrack(() => ({ chartName, defaultTooltipEventType, validateTooltipEventTypes, tooltipPayloadSearcher, eventEmitter: undefined }));

  const otherCategoricalProps = $derived(omit(polarChartProps as RechartsBag<PolarChartProps>, ['layout']));
</script>

<RechartsStoreProvider preloadedState={{ options }} reduxStoreName={polarChartProps.id ?? chartName}>
  <ChartDataContextProvider chartData={polarChartProps.data}
  /><ReportMainChartProps layout={polarChartProps.layout} margin={polarChartProps.margin}
  /><ReportEventSettings throttleDelay={polarChartProps.throttleDelay} throttledEvents={polarChartProps.throttledEvents}
  /><ReportChartProps
    baseValue={undefined}
    accessibilityLayer={polarChartProps.accessibilityLayer}
    barCategoryGap={polarChartProps.barCategoryGap}
    maxBarSize={polarChartProps.maxBarSize}
    stackOffset={polarChartProps.stackOffset}
    barGap={polarChartProps.barGap}
    barSize={polarChartProps.barSize}
    syncId={polarChartProps.syncId}
    syncMethod={polarChartProps.syncMethod}
    className={polarChartProps.className}
    reverseStackOrder={polarChartProps.reverseStackOrder}
  /><ReportPolarOptions
    cx={polarChartProps.cx}
    cy={polarChartProps.cy}
    startAngle={polarChartProps.startAngle}
    endAngle={polarChartProps.endAngle}
    innerRadius={polarChartProps.innerRadius}
    outerRadius={polarChartProps.outerRadius}
  /><CategoricalChart {...otherCategoricalProps} bind:ref />
</RechartsStoreProvider>
