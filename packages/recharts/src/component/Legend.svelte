<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { SvelteArgs } from '../util/svelteProps.js';
  import type { LegendPayload, Props as DefaultLegendContentProps } from './DefaultLegendContent.js';
  import type { ContentProps, Props as UpstreamProps } from './Legend.js';

  /** What a Legend content snippet receives: the Legend's props, the chart's size and margin, and the payload to draw. */
  export type LegendContentProps = Omit<ContentProps, 'contextPayload' | 'content'> & Omit<DefaultLegendContentProps, 'payload'> & { payload: ReadonlyArray<LegendPayload> };

  /** Legend's public props: `class` for `className`, which reaches the content, and content is a snippet where upstream takes an element or a component. */
  export type LegendProps = Omit<UpstreamProps, 'content' | 'className'> & { class?: string; content?: Snippet<[SvelteArgs<LegendContentProps>]> };
</script>

<script lang="ts">
  import type { CSSProperties } from '../react.js';
  import { getUniqPayload } from '../util/payload/getUniqPayload.js';
  import { rechartsProps, type RechartsBag } from '../util/svelteProps.js';
  import { attrs } from '../util/attrs.js';
  import { useElementOffset } from '../util/useElementOffset.svelte.js';
  import { useLegendPayload } from '../context/legendPayloadContext.js';
  import { useLegendPortal } from '../context/legendPortalContext.js';
  import { useChartHeight, useChartWidth, useMargin } from '../context/chartLayoutContext.svelte.js';
  import Portal from '../util/Portal.svelte';
  import RenderProp from '../util/RenderProp.svelte';
  import { defaultUniqBy, getDefaultPosition, getWidthOrHeight, legendDefaultProps } from './Legend.js';
  import LegendSettingsDispatcher from './LegendSettingsDispatcher.svelte';
  import LegendSizeDispatcher from './LegendSizeDispatcher.svelte';
  import DefaultLegendContent from './DefaultLegendContent.svelte';

  let raw: LegendProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof legendDefaultProps>(() => raw as UpstreamProps, legendDefaultProps);
  const contextPayload = useLegendPayload();
  const legendPortalFromContext = useLegendPortal();
  const margin = useMargin();
  // The contextPayload is not used directly inside the hook, but we need the onBBoxUpdate call
  // when the payload changes, therefore it's here as a dependency.
  const [lastBoundingBox, updateBoundingBox] = useElementOffset(() => [contextPayload.current]);
  const chartWidth = useChartWidth();
  const chartHeight = useChartHeight();

  const maxWidth = $derived((chartWidth.current ?? 0) - (margin.current?.left || 0) - (margin.current?.right || 0));
  const widthOrHeight = $derived(getWidthOrHeight(resolved.layout, resolved.height, resolved.width, maxWidth));
  // if the user supplies their own portal, only use their defined wrapper styles
  const outerStyle: CSSProperties | undefined = $derived(
    resolved.portal
      ? resolved.wrapperStyle
      : {
          position: 'absolute',
          width: widthOrHeight?.width || resolved.width || 'auto',
          height: widthOrHeight?.height || resolved.height || 'auto',
          ...getDefaultPosition(resolved.wrapperStyle, resolved, margin.current, chartWidth.current ?? 0, chartHeight.current ?? 0, lastBoundingBox.current),
          ...resolved.wrapperStyle,
        },
  );

  const legendPortal = $derived(resolved.portal ?? legendPortalFromContext.current);
  // Upstream's wrapper commits before the chart's svg, so its portals come first; here the svg exists by now, so they go in front of it.
  const portalAnchor = $derived(resolved.portal ? null : (legendPortal?.querySelector(':scope > svg') ?? null));

  const contentProps = $derived.by((): LegendContentProps => {
    const payload = contextPayload.current ?? [];
    return {
      ...resolved,
      ...widthOrHeight,
      margin: margin.current,
      chartWidth: chartWidth.current ?? 0,
      chartHeight: chartHeight.current ?? 0,
      payload: getUniqPayload(payload, resolved.payloadUniqBy, defaultUniqBy),
    } as LegendContentProps;
  });
</script>

{#if chartWidth.current != null && chartHeight.current != null && legendPortal != null && contextPayload.current != null}<Portal target={legendPortal} anchor={portalAnchor}
    ><div {...attrs({ className: 'recharts-legend-wrapper', style: outerStyle })} {@attach updateBoundingBox}
      ><LegendSettingsDispatcher layout={resolved.layout} align={resolved.align} verticalAlign={resolved.verticalAlign} itemSorter={resolved.itemSorter} />{#if !resolved.portal}<LegendSizeDispatcher
          width={lastBoundingBox.current.width}
          height={lastBoundingBox.current.height}
        />{/if}{#if typeof raw.content === 'function'}<RenderProp of={raw.content} props={contentProps} />{:else}<DefaultLegendContent {...contentProps as RechartsBag<DefaultLegendContentProps>} />{/if}</div
    ></Portal
  >{/if}
