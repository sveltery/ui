<script lang="ts">
  import { noop } from '../util/DataUtils.js';
  import { getTooltipNameProp } from '../util/ChartUtils.js';
  import type { TooltipPayloadConfiguration } from '../state/tooltipSlice.js';
  import SetTooltipEntrySettings from '../state/SetTooltipEntrySettings.svelte';
  import type { InternalProps } from './RadialBar.js';

  let { dataKey, sectors, stroke, strokeWidth, name, hide, fill, tooltipType, id }: Pick<InternalProps, 'dataKey' | 'sectors' | 'stroke' | 'strokeWidth' | 'name' | 'hide' | 'fill' | 'tooltipType' | 'id'> = $props();

  const tooltipEntrySettings: TooltipPayloadConfiguration = $derived({
    dataDefinedOnItem: sectors,
    getPosition: noop,
    settings: {
      graphicalItemId: id,
      stroke,
      strokeWidth,
      fill,
      nameKey: undefined,
      dataKey,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: tooltipType,
      color: fill,
      unit: '',
    },
  });
</script>

<SetTooltipEntrySettings {tooltipEntrySettings} />
