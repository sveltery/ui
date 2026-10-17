<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { adaptEventsOfChild, type ActiveShape } from '../util/types.js';
  import { DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME, DATA_ITEM_INDEX_ATTRIBUTE_NAME } from '../util/Constants.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectActiveTooltipDataKey, selectActiveTooltipGraphicalItemId, selectActiveTooltipIndex } from '../state/selectors/tooltipSelectors.js';
  import type { GraphicalItemId } from '../state/graphicalItemsSlice.js';
  import { useMouseClickItemDispatch, useMouseEnterItemDispatch, useMouseLeaveItemDispatch } from '../context/tooltipContext.svelte.js';
  import Layer from '../container/Layer.svelte';
  import Shape from '../util/Shape.svelte';
  import type { InternalProps, PieSectorDataItem, PieShape } from './Pie.js';

  let {
    sectors,
    activeShape,
    inactiveShape: inactiveShapeProp,
    allOtherPieProps,
    shape,
    id,
  }: {
    sectors: Readonly<PieSectorDataItem[]>;
    activeShape: ActiveShape<Readonly<PieSectorDataItem>> | undefined;
    inactiveShape: ActiveShape<Readonly<PieSectorDataItem>> | undefined;
    shape: PieShape;
    allOtherPieProps: Omit<InternalProps, 'id'>;
    id: GraphicalItemId;
  } = $props();

  const activeIndex = useAppSelector(selectActiveTooltipIndex);
  const activeDataKey = useAppSelector(selectActiveTooltipDataKey);
  const activeGraphicalItemId = useAppSelector(selectActiveTooltipGraphicalItemId);

  const restOfAllOtherProps = $derived(omit(allOtherPieProps, ['onMouseEnter', 'onClick', 'onMouseLeave']));

  const onMouseEnterFromContext = useMouseEnterItemDispatch(
    () => allOtherPieProps.onMouseEnter,
    () => allOtherPieProps.dataKey,
    () => id,
  );
  const onMouseLeaveFromContext = useMouseLeaveItemDispatch(() => allOtherPieProps.onMouseLeave);
  const onClickFromContext = useMouseClickItemDispatch(
    () => allOtherPieProps.onClick,
    () => allOtherPieProps.dataKey,
    () => id,
  );

  function sectorState(entry: PieSectorDataItem, i: number) {
    // When several Pies share a dataKey, only the hovered Pie's sector is active.
    const graphicalItemMatches = activeGraphicalItemId.current == null || activeGraphicalItemId.current === id;
    const isActive = String(i) === activeIndex.current && (activeDataKey.current == null || allOtherPieProps.dataKey === activeDataKey.current) && graphicalItemMatches;
    const inactiveShape = activeIndex.current ? inactiveShapeProp : null;
    const sectorOptions = activeShape && isActive ? activeShape : inactiveShape;
    const sectorProps = {
      ...entry,
      stroke: entry.stroke,
      tabIndex: -1,
      [DATA_ITEM_INDEX_ATTRIBUTE_NAME]: i,
      [DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME]: id,
    };
    return { isActive, option: shape ?? sectorOptions, sectorProps };
  }
</script>

{#if sectors != null && sectors.length !== 0}
  {#each sectors as entry, i (`sector-${entry?.startAngle}-${entry?.endAngle}-${entry.midAngle}-${i}`)}
    {#if !(entry?.startAngle === 0 && entry?.endAngle === 0 && sectors.length !== 1)}
      {const sector = $derived(sectorState(entry, i))}
      <Layer
        tabIndex={-1}
        class="recharts-pie-sector"
        {...adaptEventsOfChild(restOfAllOtherProps, entry, i)}
        {...{ onMouseEnter: onMouseEnterFromContext(entry, i), onMouseLeave: onMouseLeaveFromContext(entry, i), onClick: onClickFromContext(entry, i) }}
      >
        <Shape option={sector.option} index={i} shapeType="sector" isActive={sector.isActive} {...sector.sectorProps} />
      </Layer>
    {/if}
  {/each}
{/if}
