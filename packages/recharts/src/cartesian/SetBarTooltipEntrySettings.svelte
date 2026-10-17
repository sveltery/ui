<script lang="ts">
  import { noop } from '../util/DataUtils.js';
  import { getTooltipNameProp } from '../util/ChartUtils.js';
  import type { TooltipPayloadConfiguration } from '../state/tooltipSlice.js';
  import SetTooltipEntrySettings from '../state/SetTooltipEntrySettings.svelte';
  import type { InternalProps } from './Bar.js';

  let { dataKey, stroke, strokeWidth, fill, name, hide, unit, tooltipType, id }: Pick<InternalProps, 'dataKey' | 'stroke' | 'strokeWidth' | 'fill' | 'name' | 'hide' | 'unit' | 'tooltipType' | 'id'> = $props();

  const tooltipEntrySettings: TooltipPayloadConfiguration = $derived({
    dataDefinedOnItem: undefined,
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
      color: fill,
      unit,
      graphicalItemId: id,
    },
  });
</script>

<SetTooltipEntrySettings {tooltipEntrySettings} />
