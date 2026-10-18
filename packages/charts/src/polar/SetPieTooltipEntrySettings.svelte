<script lang="ts">
  import { getTooltipNameProp } from '../util/ChartUtils.js';
  import type { TooltipPayloadConfiguration } from '../state/tooltipSlice.js';
  import SetTooltipEntrySettings from '../state/SetTooltipEntrySettings.svelte';
  import { getActiveShapeFill, type InternalProps } from './Pie.js';

  let {
    dataKey,
    nameKey,
    sectors,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    tooltipType,
    id,
    activeShape,
  }: Pick<InternalProps, 'dataKey' | 'nameKey' | 'sectors' | 'stroke' | 'strokeWidth' | 'fill' | 'name' | 'hide' | 'tooltipType' | 'id' | 'activeShape'> = $props();

  const tooltipEntrySettings: TooltipPayloadConfiguration = $derived.by(() => {
    const activeShapeFill = getActiveShapeFill(activeShape);
    const tooltipDataDefinedOnItem = sectors.map((sector) => {
      const sectorTooltipPayload = sector.tooltipPayload;
      if (activeShapeFill == null || sectorTooltipPayload == null) {
        return sectorTooltipPayload;
      }
      return sectorTooltipPayload.map((item) => ({
        ...item,
        color: activeShapeFill,
        fill: activeShapeFill,
      }));
    });
    return {
      dataDefinedOnItem: tooltipDataDefinedOnItem,
      getPosition: (index) => sectors[Number(index)]?.tooltipPosition,
      settings: {
        stroke,
        strokeWidth,
        fill,
        dataKey,
        nameKey,
        name: getTooltipNameProp(name, dataKey),
        hide,
        type: tooltipType,
        color: fill,
        unit: '',
        graphicalItemId: id,
      },
    };
  });
</script>

<SetTooltipEntrySettings {tooltipEntrySettings} />
