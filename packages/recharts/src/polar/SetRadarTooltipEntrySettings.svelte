<script lang="ts">
  import { noop } from '../util/DataUtils.js';
  import { getTooltipNameProp } from '../util/ChartUtils.js';
  import type { TooltipPayloadConfiguration } from '../state/tooltipSlice.js';
  import SetTooltipEntrySettings from '../state/SetTooltipEntrySettings.svelte';
  import { getLegendItemColor, type InternalRadarProps } from './Radar.js';

  let { dataKey, stroke, strokeWidth, fill, name, hide, tooltipType, id }: Pick<InternalRadarProps, 'dataKey' | 'stroke' | 'strokeWidth' | 'fill' | 'name' | 'hide' | 'tooltipType' | 'id'> = $props();

  const tooltipEntrySettings: TooltipPayloadConfiguration = $derived({
    dataDefinedOnItem: undefined,
    getPosition: noop,
    settings: {
      stroke,
      strokeWidth,
      fill,
      nameKey: undefined,
      dataKey,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: tooltipType,
      color: getLegendItemColor(stroke, fill),
      unit: '',
      graphicalItemId: id,
    },
  });
</script>

<SetTooltipEntrySettings {tooltipEntrySettings} />
