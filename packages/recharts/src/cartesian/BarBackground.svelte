<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { adaptEventsOfChild } from '../util/types.js';
  import { svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectActiveTooltipIndex } from '../state/selectors/tooltipSelectors.js';
  import { useMouseClickItemDispatch, useMouseEnterItemDispatch, useMouseLeaveItemDispatch } from '../context/tooltipContext.svelte.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
  import { getZIndexFromUnknown } from '../zIndex/getZIndexFromUnknown.js';
  import BarRectangle from '../util/BarRectangle.svelte';
  import type { BarRectangleProps } from '../util/BarUtils.js';
  import type { BarRectangleItem, InternalProps } from './Bar.js';

  let {
    data,
    dataKey,
    background: backgroundFromProps,
    allOtherBarProps,
  }: {
    background?: InternalProps['background'];
    data: ReadonlyArray<BarRectangleItem> | undefined;
    dataKey: InternalProps['dataKey'];
    allOtherBarProps: InternalProps;
  } = $props();

  const activeIndex = useAppSelector(selectActiveTooltipIndex);

  const restOfAllOtherProps = $derived(omit(allOtherBarProps, ['onMouseEnter', 'onMouseLeave', 'onClick']));

  const onMouseEnterFromContext = useMouseEnterItemDispatch(
    () => allOtherBarProps.onMouseEnter,
    () => dataKey,
    () => allOtherBarProps.id,
  );
  const onMouseLeaveFromContext = useMouseLeaveItemDispatch(() => allOtherBarProps.onMouseLeave);
  const onClickFromContext = useMouseClickItemDispatch(
    () => allOtherBarProps.onClick,
    () => dataKey,
    () => allOtherBarProps.id,
  );

  const backgroundProps = $derived(svgPropertiesNoEventsFromUnknown(backgroundFromProps));

  function barRectangleProps(entry: BarRectangleItem, i: number): BarRectangleProps {
    const { background: backgroundFromDataEntry, ...rest } = omit(entry, ['value', 'tooltipPosition']);
    return {
      option: backgroundFromProps,
      isActive: String(i) === activeIndex.current,
      ...rest,
      fill: '#eee',
      ...backgroundFromDataEntry,
      ...backgroundProps,
      ...adaptEventsOfChild(restOfAllOtherProps, entry, i),
      onMouseEnter: onMouseEnterFromContext(entry, i),
      onMouseLeave: onMouseLeaveFromContext(entry, i),
      onClick: onClickFromContext(entry, i),
      dataKey,
      index: i,
      className: 'recharts-bar-background-rectangle',
    } as BarRectangleProps;
  }
</script>

{#if backgroundFromProps && data != null}
  <ZIndexLayer zIndex={getZIndexFromUnknown(backgroundFromProps, DefaultZIndexes.barBackground)}>
    {#each data as entry, i (i)}
      {#if entry.background}
        <BarRectangle {...barRectangleProps(entry, i)} />
      {/if}
    {/each}
  </ZIndexLayer>
{/if}
