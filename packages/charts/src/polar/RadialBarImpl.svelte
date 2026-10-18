<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getNormalizedStackId } from '../util/ChartUtils.js';
  import type { WithIdRequired } from '../util/useUniqueId.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectRadialBarSectors } from '../state/selectors/radialBarSelectors.js';
  import type { RadialBarSettings } from '../state/types/RadialBarSettings.js';
  import { provideCellReader } from '../component/Cell.hooks.svelte.js';
  import { STABLE_EMPTY_ARRAY, type PropsWithDefaults, type RadialBarDataItem } from './RadialBar.js';
  import SetRadialBarTooltipEntrySettings from './SetRadialBarTooltipEntrySettings.svelte';
  import RadialBarWithState from './RadialBarWithState.svelte';

  let props: WithIdRequired<PropsWithDefaults> & { children?: Snippet } = $props();

  // Upstream finds the Cell elements among its children. Cells rendered in this RadialBar's children register here instead.
  const cells = provideCellReader();

  const radialBarSettings: RadialBarSettings = $derived({
    data: undefined,
    hide: false,
    id: props.id,
    dataKey: props.dataKey,
    minPointSize: props.minPointSize,
    stackId: getNormalizedStackId(props.stackId),
    maxBarSize: props.maxBarSize,
    barSize: props.barSize,
    type: 'radialBar',
    angleAxisId: props.angleAxisId,
    radiusAxisId: props.radiusAxisId,
  });
  const selected = useAppSelector((state) => selectRadialBarSectors(state, props.radiusAxisId, props.angleAxisId, radialBarSettings, cells.current));
  const sectors: ReadonlyArray<RadialBarDataItem> = $derived(selected.current ?? STABLE_EMPTY_ARRAY);
</script>

<SetRadialBarTooltipEntrySettings
  dataKey={props.dataKey}
  {sectors}
  stroke={props.stroke}
  strokeWidth={props.strokeWidth}
  name={props.name}
  hide={props.hide}
  fill={props.fill}
  tooltipType={props.tooltipType}
  id={props.id}
/>
<RadialBarWithState {...props} {sectors} />
