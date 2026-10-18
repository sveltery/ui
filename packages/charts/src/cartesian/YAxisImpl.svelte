<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { clsx } from 'clsx';
  import { useAppDispatch, useAppSelector } from '../state/hooks.svelte.js';
  import { selectTicksOfAxis, selectYAxisPosition, selectYAxisSettingsNoDefaults, selectYAxisSize } from '../state/selectors/axisSelectors.js';
  import { selectAxisViewBox } from '../state/selectors/selectChartOffsetInternal.js';
  import { updateYAxisWidth } from '../state/cartesianAxisSlice.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import { isLabelContentAFunction } from '../component/Label.js';
  import type { Props, yAxisDefaultProps } from './YAxis.js';
  import type { RequiresDefaultProps } from '../util/resolveDefaultProps.js';
  import CartesianAxis, { type CartesianAxisProps } from './CartesianAxis.svelte';

  let props: RequiresDefaultProps<Props, typeof yAxisDefaultProps> = $props();
  let cartesianAxisRef = $state<ReturnType<typeof CartesianAxis> | null>(null);
  const labelRef: { current: SVGTextElement | null } = { current: null };

  const viewBox = useAppSelector(selectAxisViewBox);
  const isPanorama = useIsPanorama();
  const dispatch = useAppDispatch();
  const axisType = 'yAxis';
  const axisSize = useAppSelector((state) => selectYAxisSize(state, props.yAxisId));
  const position = useAppSelector((state) => selectYAxisPosition(state, props.yAxisId));
  const cartesianTickItems = useAppSelector((state) => selectTicksOfAxis(state, axisType, props.yAxisId, isPanorama));
  // The axis settings in the store, which may differ from the props: the store fills in some defaults on its own.
  const synchronizedSettings = useAppSelector((state) => selectYAxisSettingsNoDefaults(state, props.yAxisId));

  $effect(() => {
    void cartesianTickItems.current;
    const size = axisSize.current;
    const { width, label, yAxisId } = props;
    // No measuring unless width is 'auto', or when a function or element renders the label.
    if (width !== 'auto' || !size || isLabelContentAFunction(label) || synchronizedSettings.current == null) {
      return;
    }
    const axisComponent = cartesianAxisRef;
    if (!axisComponent) {
      return;
    }
    const updatedYAxisWidth = axisComponent.getCalculatedWidth();
    if (Math.round(size.width) !== Math.round(updatedYAxisWidth)) {
      dispatch(updateYAxisWidth({ id: yAxisId, width: updatedYAxisWidth }));
    }
  });

  const axisProps = $derived.by(() => {
    if (axisSize.current == null || position.current == null || synchronizedSettings.current == null) {
      return null;
    }
    const allOtherProps = omit(props as Props & { dangerouslySetInnerHTML?: unknown }, ['dangerouslySetInnerHTML', 'ticks', 'scale']);
    const restSynchronizedSettings = omit(synchronizedSettings.current, ['id', 'scale']);
    const { width } = props;
    return {
      ...allOtherProps,
      ...restSynchronizedSettings,
      labelRef,
      x: position.current.x,
      y: position.current.y,
      tickTextProps: width === 'auto' ? { width: undefined } : { width },
      width: axisSize.current.width,
      height: axisSize.current.height,
      className: clsx(`recharts-${axisType} ${axisType}`, props.className),
      viewBox: viewBox.current,
      ticks: cartesianTickItems.current,
      axisType,
      axisId: props.yAxisId,
    } as unknown as CartesianAxisProps;
  });
</script>

{#if axisProps}
  <CartesianAxis {...axisProps} bind:this={cartesianAxisRef} />
{/if}
