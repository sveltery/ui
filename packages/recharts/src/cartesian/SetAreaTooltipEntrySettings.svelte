<script lang="ts">
  import { noop } from '../util/DataUtils.js';
  import { getTooltipNameProp } from '../util/ChartUtils.js';
  import type { WithIdRequired } from '../util/useUniqueId.js';
  import type { TooltipPayloadConfiguration } from '../state/tooltipSlice.js';
  import SetTooltipEntrySettings from '../state/SetTooltipEntrySettings.svelte';
  import { getLegendItemColor, type Props } from './Area.js';

  let {
    dataKey,
    data,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    unit,
    tooltipType,
    id,
  }: Pick<WithIdRequired<Props<unknown, unknown>>, 'dataKey' | 'data' | 'stroke' | 'strokeWidth' | 'fill' | 'name' | 'hide' | 'unit' | 'tooltipType' | 'id'> = $props();

  const tooltipEntrySettings: TooltipPayloadConfiguration = $derived({
    dataDefinedOnItem: data,
    getPosition: noop,
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey: undefined,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: tooltipType,
      color: getLegendItemColor(stroke, fill),
      unit,
      graphicalItemId: id,
    },
  });
</script>

<SetTooltipEntrySettings {tooltipEntrySettings} />
