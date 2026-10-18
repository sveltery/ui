<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import type { Snippet } from 'svelte';
  import { adaptEventsOfChild } from '../util/types.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import { parseCornerRadius, type RadialBarSectorProps } from '../util/RadialBarUtils.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectActiveTooltipIndex } from '../state/selectors/tooltipSelectors.js';
  import { useMouseClickItemDispatch, useMouseEnterItemDispatch, useMouseLeaveItemDispatch } from '../context/tooltipContext.svelte.js';
  import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import RadialBarSector from '../util/RadialBarSector.svelte';
  import type { InternalProps, RadialBarDataItem } from './RadialBar.js';

  let { sectors, allOtherRadialBarProps }: { sectors: ReadonlyArray<RadialBarDataItem>; allOtherRadialBarProps: InternalProps & { children?: Snippet } } = $props();

  const others = $derived(omit(allOtherRadialBarProps, ['shape', 'activeShape', 'cornerRadius', 'id']));
  const baseProps = $derived(svgPropertiesNoEvents(others));

  const activeIndex = useAppSelector(selectActiveTooltipIndex);
  const restOfAllOtherProps = $derived(omit(allOtherRadialBarProps, ['onMouseEnter', 'onClick', 'onMouseLeave']));

  const onMouseEnterFromContext = useMouseEnterItemDispatch(
    () => allOtherRadialBarProps.onMouseEnter,
    () => allOtherRadialBarProps.dataKey,
    () => allOtherRadialBarProps.id,
  );
  const onMouseLeaveFromContext = useMouseLeaveItemDispatch(() => allOtherRadialBarProps.onMouseLeave);
  const onClickFromContext = useMouseClickItemDispatch(
    () => allOtherRadialBarProps.onClick,
    () => allOtherRadialBarProps.dataKey,
    () => allOtherRadialBarProps.id,
  );

  function sectorProps(entry: RadialBarDataItem, i: number): RadialBarSectorProps {
    const { shape, activeShape, cornerRadius } = allOtherRadialBarProps;
    const isActive: boolean = Boolean(activeShape && activeIndex.current === String(i));
    return {
      ...baseProps,
      cornerRadius: parseCornerRadius(cornerRadius),
      ...entry,
      ...adaptEventsOfChild(restOfAllOtherProps, entry, i),
      onMouseEnter: onMouseEnterFromContext(entry, i),
      onMouseLeave: onMouseLeaveFromContext(entry, i),
      onClick: onClickFromContext(entry, i),
      className: `recharts-radial-bar-sector ${entry.className}`,
      forceCornerRadius: others.forceCornerRadius,
      cornerIsExternal: others.cornerIsExternal,
      isActive,
      option: isActive ? activeShape : shape,
      index: i,
    } as RadialBarSectorProps;
  }
</script>

{#if sectors != null}
  {#each sectors as entry, i (`sector-${entry.cx}-${entry.cy}-${entry.innerRadius}-${entry.outerRadius}-${entry.startAngle}-${entry.endAngle}-${i}`)}
    {const radialBarSectorProps = $derived(sectorProps(entry, i))}
    {#if radialBarSectorProps.isActive}
      <ZIndexLayer zIndex={DefaultZIndexes.activeBar}>
        <RadialBarSector {...radialBarSectorProps} />
      </ZIndexLayer>
    {:else}
      <RadialBarSector {...radialBarSectorProps} />
    {/if}
  {/each}
{/if}
