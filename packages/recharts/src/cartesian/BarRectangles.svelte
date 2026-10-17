<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { adaptEventsOfChild } from '../util/types.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import { useMouseClickItemDispatch, useMouseEnterItemDispatch, useMouseLeaveItemDispatch } from '../context/tooltipContext.svelte.js';
  import BarRectangle from '../util/BarRectangle.svelte';
  import BarStackClipLayer from './BarStackClipLayer.svelte';
  import BarRectangleWithActiveState from './BarRectangleWithActiveState.svelte';
  import type { BarRectangleItem, InternalProps } from './Bar.js';

  let { data, props }: { data: ReadonlyArray<BarRectangleItem> | undefined; props: InternalProps } = $props();

  const filtered = $derived((svgPropertiesNoEvents(props) ?? {}) as Record<string, unknown> & { id?: string });
  const id = $derived(filtered.id);
  const baseProps = $derived(omit(filtered, ['id']));

  const restOfAllOtherProps = $derived(omit(props, ['onMouseEnter', 'onClick', 'onMouseLeave']));

  const onMouseEnterFromContext = useMouseEnterItemDispatch(
    () => props.onMouseEnter,
    () => props.dataKey,
    () => id as string,
  );
  const onMouseLeaveFromContext = useMouseLeaveItemDispatch(() => props.onMouseLeave);
  const onClickFromContext = useMouseClickItemDispatch(
    () => props.onClick,
    () => props.dataKey,
    () => id as string,
  );
</script>

{#if data}
  {#each data as entry, i (i)}
    <BarStackClipLayer
      index={entry.originalDataIndex}
      class="recharts-bar-rectangle"
      {...adaptEventsOfChild(restOfAllOtherProps, entry, i)}
      {...{ onMouseEnter: onMouseEnterFromContext(entry, i), onMouseLeave: onMouseLeaveFromContext(entry, i), onClick: onClickFromContext(entry, i) }}
    >
      {#if props.activeBar}
        <BarRectangleWithActiveState shape={props.shape} activeBar={props.activeBar} {baseProps} {entry} index={i} dataKey={props.dataKey} />
      {:else}
        <BarRectangle {...baseProps} name={String(baseProps.name)} {...entry} isActive={false} option={props.shape} index={i} dataKey={props.dataKey} />
      {/if}
    </BarStackClipLayer>
  {/each}
{/if}
