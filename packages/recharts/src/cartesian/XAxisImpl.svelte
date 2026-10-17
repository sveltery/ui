<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { clsx } from 'clsx';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectTicksOfAxis, selectXAxisPosition, selectXAxisSettingsNoDefaults, selectXAxisSize } from '../state/selectors/axisSelectors.js';
  import { selectAxisViewBox } from '../state/selectors/selectChartOffsetInternal.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import type { Props, xAxisDefaultProps } from './XAxis.js';
  import type { RequiresDefaultProps } from '../util/resolveDefaultProps.js';
  import CartesianAxis, { type CartesianAxisProps } from './CartesianAxis.svelte';

  let props: RequiresDefaultProps<Props, typeof xAxisDefaultProps> = $props();
  const axisType = 'xAxis';
  const viewBox = useAppSelector(selectAxisViewBox);
  const isPanorama = useIsPanorama();
  const cartesianTickItems = useAppSelector((state) => selectTicksOfAxis(state, axisType, props.xAxisId, isPanorama));
  const axisSize = useAppSelector((state) => selectXAxisSize(state, props.xAxisId));
  const position = useAppSelector((state) => selectXAxisPosition(state, props.xAxisId));
  // The axis settings in the store, which may differ from the props: the store fills in some defaults on its own.
  const synchronizedSettings = useAppSelector((state) => selectXAxisSettingsNoDefaults(state, props.xAxisId));

  const axisProps = $derived.by(() => {
    if (axisSize.current == null || position.current == null || synchronizedSettings.current == null) {
      return null;
    }
    const allOtherProps = omit(props as Props & { dangerouslySetInnerHTML?: unknown }, ['dangerouslySetInnerHTML', 'ticks', 'scale']);
    const restSynchronizedSettings = omit(synchronizedSettings.current, ['id', 'scale']);
    return {
      ...allOtherProps,
      ...restSynchronizedSettings,
      x: position.current.x,
      y: position.current.y,
      width: axisSize.current.width,
      height: axisSize.current.height,
      className: clsx(`recharts-${axisType} ${axisType}`, props.className),
      viewBox: viewBox.current,
      ticks: cartesianTickItems.current,
      axisType,
      axisId: props.xAxisId,
    } as unknown as CartesianAxisProps;
  });
</script>

{#if axisProps}
  <CartesianAxis {...axisProps} />
{/if}
