<script lang="ts">
  import { untrack } from 'svelte';
  import type { ChartOptions } from '../state/optionsSlice.js';
  import type { CartesianChartProps } from '../util/types.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import RechartsStoreProvider from '../state/RechartsStoreProvider.svelte';
  import ChartDataContextProvider from '../context/ChartDataContextProvider.svelte';
  import ReportMainChartProps from '../state/ReportMainChartProps.svelte';
  import ReportChartProps from '../state/ReportChartProps.svelte';
  import ReportEventSettings from '../state/ReportEventSettings.svelte';
  import { defaultCartesianChartProps, type CartesianChartOptions } from './CartesianChart.js';
  import CategoricalChart from './CategoricalChart.svelte';

  type Props = Omit<CartesianChartOptions, 'categoricalChartProps'> & {
    categoricalChartProps: SvelteProps<CartesianChartProps>;
    ref?: SVGSVGElement | null;
  };

  let { chartName, defaultTooltipEventType, validateTooltipEventTypes, tooltipPayloadSearcher, categoricalChartProps, ref = $bindable(null) }: Props = $props();

  const rootChartProps = rechartsProps<CartesianChartProps, typeof defaultCartesianChartProps>(() => categoricalChartProps, defaultCartesianChartProps);
  // These options are fixed for the chart's lifetime, like the store they seed.
  const options: ChartOptions = untrack(() => ({ chartName, defaultTooltipEventType, validateTooltipEventTypes, tooltipPayloadSearcher, eventEmitter: undefined }));
</script>

<RechartsStoreProvider preloadedState={{ options }} reduxStoreName={categoricalChartProps.id ?? chartName}>
  <ChartDataContextProvider chartData={categoricalChartProps.data}
  /><ReportMainChartProps layout={rootChartProps.layout} margin={rootChartProps.margin}
  /><ReportEventSettings throttleDelay={rootChartProps.throttleDelay} throttledEvents={rootChartProps.throttledEvents}
  /><ReportChartProps
    baseValue={rootChartProps.baseValue}
    accessibilityLayer={rootChartProps.accessibilityLayer}
    barCategoryGap={rootChartProps.barCategoryGap}
    maxBarSize={rootChartProps.maxBarSize}
    stackOffset={rootChartProps.stackOffset}
    barGap={rootChartProps.barGap}
    barSize={rootChartProps.barSize}
    syncId={rootChartProps.syncId}
    syncMethod={rootChartProps.syncMethod}
    className={rootChartProps.className}
    reverseStackOrder={rootChartProps.reverseStackOrder}
  /><CategoricalChart {...rootChartProps} bind:ref />
</RechartsStoreProvider>
