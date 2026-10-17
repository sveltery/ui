<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { clsx } from 'clsx';
  import { isNullish, uniqueId } from '../util/DataUtils.js';
  import { polarToCartesian } from '../util/PolarUtils.js';
  import type { PolarViewBoxRequired, TrapezoidViewBox } from '../util/types.js';
  import { cartesianViewBoxToTrapezoid } from '../context/chartLayoutContext.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { getCartesianPosition } from '../cartesian/getCartesianPosition.js';
  import { attrs as toAttributes } from '../util/attrs.js';
  import { rechartsProps } from '../util/svelteProps.js';
  import RenderProp from '../util/RenderProp.svelte';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import { defaultLabelProps, getAttrsOfPolarLabel, getDeltaAngle, getLabel, isPolar, polarViewBoxToTrapezoid, type LabelPositionAttributes, type Props } from './Label.js';
  import { isValidTextAnchor } from './Text.js';
  import Text from './Text.svelte';
  import { useCartesianLabelContext, usePolarLabelContext, type LabelProps } from './Label.hooks.svelte.js';

  let raw: LabelProps = $props();
  const resolved = rechartsProps<Props, typeof defaultLabelProps>(() => raw as Props, defaultLabelProps);

  const polarViewBox = usePolarLabelContext();
  const cartesianViewBox = useCartesianLabelContext();

  // Upstream's quick fix for recharts#6030: a centered label uses the Cartesian box even in a polar chart.
  const resolvedViewBox = $derived(resolved.position === 'center' ? cartesianViewBox.current : (polarViewBox.current ?? cartesianViewBox.current));

  const viewBox: PolarViewBoxRequired | TrapezoidViewBox | undefined = $derived.by(() => {
    const viewBoxFromProps = resolved.viewBox;
    if (viewBoxFromProps == null) return resolvedViewBox;
    if (isPolar(viewBoxFromProps)) return viewBoxFromProps;
    return cartesianViewBoxToTrapezoid(viewBoxFromProps);
  });

  const content = $derived(resolved.content as unknown);
  const hasContent = $derived(typeof content === 'function');
  const visible = $derived(!!viewBox && !(isNullish(resolved.value) && isNullish(resolved.children) && !hasContent));

  const propsForContent = $derived({ ...omit(resolved, ['content']), viewBox });

  type Rendered =
    | { kind: 'radial'; attributes: Record<string, unknown>; id: string; path: string; label: unknown }
    | { kind: 'text'; textProps: Record<string, unknown>; label: unknown }
    | null;

  const rendered: Rendered = $derived.by(() => {
    if (!visible || hasContent || !viewBox) return null;
    const label = getLabel(resolved as Props);
    const attrs = svgPropertiesAndEvents(resolved);
    const { position, offset, className } = resolved;
    let positionAttrs: LabelPositionAttributes;
    if (isPolar(viewBox)) {
      if (position === 'insideStart' || position === 'insideEnd' || position === 'end') {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, clockWise } = viewBox;
        const radius = (innerRadius + outerRadius) / 2;
        const deltaAngle = getDeltaAngle(startAngle, endAngle);
        const sign = deltaAngle >= 0 ? 1 : -1;
        let labelAngle, direction;
        switch (position) {
          case 'insideStart':
            labelAngle = startAngle + sign * offset;
            direction = clockWise;
            break;
          case 'insideEnd':
            labelAngle = endAngle - sign * offset;
            direction = !clockWise;
            break;
          default:
            labelAngle = endAngle + sign * offset;
            direction = clockWise;
            break;
        }
        direction = deltaAngle <= 0 ? direction : !direction;
        const startPoint = polarToCartesian(cx, cy, radius, labelAngle);
        const endPoint = polarToCartesian(cx, cy, radius, labelAngle + (direction ? 1 : -1) * 359);
        const path = `M${startPoint.x},${startPoint.y}
    A${radius},${radius},0,1,${direction ? 0 : 1},
    ${endPoint.x},${endPoint.y}`;
        const id = isNullish(resolved.id) ? uniqueId('recharts-radial-line-') : resolved.id;
        return {
          kind: 'radial',
          attributes: toAttributes({ ...attrs, dominantBaseline: 'central', className: clsx('recharts-radial-bar-label', className) }),
          id,
          path,
          label,
        };
      }
      positionAttrs = getAttrsOfPolarLabel(viewBox, offset, position);
    } else {
      const cartesianBox = polarViewBoxToTrapezoid(viewBox);
      if (!cartesianBox) return null;
      const parentViewBox = resolved.parentViewBox;
      const cartesianResult = getCartesianPosition({
        viewBox: cartesianBox,
        position,
        offset,
        parentViewBox: isPolar(parentViewBox) ? undefined : parentViewBox,
        clamp: true,
      });
      positionAttrs = {
        x: cartesianResult.x,
        y: cartesianResult.y,
        textAnchor: cartesianResult.horizontalAnchor,
        verticalAnchor: cartesianResult.verticalAnchor,
        ...(cartesianResult.width !== undefined ? { width: cartesianResult.width } : {}),
        ...(cartesianResult.height !== undefined ? { height: cartesianResult.height } : {}),
      };
    }
    return {
      kind: 'text',
      textProps: {
        className: clsx('recharts-label', className ?? ''),
        ...attrs,
        ...positionAttrs,
        // The position decides the anchor, but an explicit textAnchor prop wins.
        textAnchor: isValidTextAnchor(attrs.textAnchor) ? attrs.textAnchor : positionAttrs.textAnchor,
        breakAll: resolved.textBreakAll,
      },
      label,
    };
  });
</script>

{#if visible && hasContent}
  <RenderProp of={content as never} props={propsForContent} />
{:else if rendered?.kind === 'radial'}
  <text {...rendered.attributes}><defs><path id={rendered.id} d={rendered.path} /></defs><textPath xlink:href="#{rendered.id}">{typeof rendered.label === 'boolean' ? '' : rendered.label}</textPath></text>
{:else if rendered?.kind === 'text'}
  <ZIndexLayer zIndex={resolved.zIndex}>
    <Text
      {...rendered.textProps}
      children={rendered.label as never}
      bind:ref={() => resolved.labelRef?.current ?? null, (node) => {
        if (resolved.labelRef) resolved.labelRef.current = node as SVGTextElement;
      }}
    />
  </ZIndexLayer>
{/if}
