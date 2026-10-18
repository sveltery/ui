<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { BaseTickContentProps } from '../util/types.js';
  import type { ImplicitLabelType } from '../component/Label.hooks.svelte.js';
  import type { Props as UpstreamProps } from './CartesianAxis.js';

  export type CartesianAxisProps = Omit<SvelteProps<WithSnippets<UpstreamProps, { tick: BaseTickContentProps }>>, 'label'> & { label?: ImplicitLabelType };
</script>

<script lang="ts">
  import { omit } from 'es-toolkit';
  import type { Attachment } from 'svelte/attachments';
  import { clsx } from 'clsx';
  import get from 'es-toolkit/compat/get';
  import type { SVGProps } from '../react.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import { getCalculatedYAxisWidth } from '../util/YAxisUtils.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps } from '../util/svelteProps.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import Layer from '../container/Layer.svelte';
  import CartesianLabelContextProvider from '../component/CartesianLabelContextProvider.svelte';
  import CartesianLabelFromLabelProp from '../component/CartesianLabelFromLabelProp.svelte';
  import { defaultCartesianAxisProps, type Orientation } from './CartesianAxis.js';
  import Ticks from './Ticks.svelte';

  let raw: CartesianAxisProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof defaultCartesianAxisProps>(() => raw as UpstreamProps, defaultCartesianAxisProps);

  let fontSize = $state('');
  let letterSpacing = $state('');
  let tickRefs: HTMLCollection | null = null;

  /** Upstream exposes this through useImperativeHandle; YAxis calls it to size an `auto` width axis. */
  export function getCalculatedWidth(): number {
    return getCalculatedYAxisWidth({
      ticks: tickRefs,
      label: resolved.labelRef?.current,
      labelGapWithTick: 5,
      tickSize: resolved.tickSize,
      tickMargin: resolved.tickMargin,
    });
  }

  // Upstream's callback ref depends on fontSize and letterSpacing, so it runs again when they change; reading them here does the same.
  const layerRef: Attachment<SVGGElement> = (el) => {
    const tickNodes = el.getElementsByClassName('recharts-cartesian-axis-tick-value');
    tickRefs = tickNodes;
    const tick: Element | undefined = tickNodes[0];
    if (tick) {
      const computedStyle = window.getComputedStyle(tick);
      const calculatedFontSize = computedStyle.fontSize;
      const calculatedLetterSpacing = computedStyle.letterSpacing;
      if (calculatedFontSize !== fontSize || calculatedLetterSpacing !== letterSpacing) {
        fontSize = calculatedFontSize;
        letterSpacing = calculatedLetterSpacing;
      }
    }
  };

  const rest = $derived(omit(resolved, ['axisLine', 'width', 'height', 'className', 'hide', 'ticks', 'axisType', 'axisId']));

  function axisLineAttributes(x: number, y: number, width: number, height: number, orientation: Orientation, mirror: boolean, axisLine: boolean | SVGProps<SVGLineElement>, otherSvgProps: SVGProps<SVGLineElement> | null) {
    let lineProps: SVGProps<SVGLineElement> = { ...otherSvgProps, ...svgPropertiesNoEvents(axisLine), fill: 'none' };
    if (orientation === 'top' || orientation === 'bottom') {
      const needHeight = +((orientation === 'top' && !mirror) || (orientation === 'bottom' && mirror));
      lineProps = { ...lineProps, x1: x, y1: y + needHeight * height, x2: x + width, y2: y + needHeight * height };
    } else {
      const needWidth = +((orientation === 'left' && !mirror) || (orientation === 'right' && mirror));
      lineProps = { ...lineProps, x1: x + needWidth * width, y1: y, x2: x + needWidth * width, y2: y + height };
    }
    return attrs({ ...lineProps, className: clsx('recharts-cartesian-axis-line', get(axisLine, 'className')) });
  }
</script>

{#if !resolved.hide && !((resolved.width != null && resolved.width <= 0) || (resolved.height != null && resolved.height <= 0))}
  <ZIndexLayer zIndex={resolved.zIndex}>
    <Layer class={clsx('recharts-cartesian-axis', resolved.className)}>
      {#if resolved.axisLine}
        <line {...axisLineAttributes(resolved.x, resolved.y, resolved.width, resolved.height, resolved.orientation, resolved.mirror, resolved.axisLine, svgPropertiesNoEvents(resolved))} />
      {/if}
      <Ticks
        {layerRef}
        axisType={resolved.axisType}
        events={rest}
        {fontSize}
        getTicksConfig={resolved}
        height={resolved.height}
        {letterSpacing}
        mirror={resolved.mirror}
        orientation={resolved.orientation}
        padding={resolved.padding}
        stroke={resolved.stroke}
        tick={resolved.tick}
        tickFormatter={resolved.tickFormatter}
        tickLine={resolved.tickLine}
        tickMargin={resolved.tickMargin}
        tickSize={resolved.tickSize}
        tickTextProps={resolved.tickTextProps}
        ticks={resolved.ticks}
        unit={resolved.unit}
        width={resolved.width}
        x={resolved.x}
        y={resolved.y}
        axisId={resolved.axisId}
      />
      <CartesianLabelContextProvider x={resolved.x} y={resolved.y} width={resolved.width} height={resolved.height} lowerWidth={resolved.width} upperWidth={resolved.width}>
        <CartesianLabelFromLabelProp label={raw.label} labelRef={resolved.labelRef} />
        {@render raw.children?.()}
      </CartesianLabelContextProvider>
    </Layer>
  </ZIndexLayer>
{/if}
