<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { SvelteArgs } from '../util/svelteProps.js';
  import type { NameType, ValueType } from './DefaultTooltipContent.js';
  import type { TooltipContentProps as UpstreamContentProps, TooltipProps as UpstreamProps } from './Tooltip.js';
  import type { CursorDefinition } from './Cursor.svelte';

  /** What a Tooltip content snippet receives: the Tooltip's props plus the active payload, label and coordinate. */
  export type TooltipContentProps<TValue extends ValueType = ValueType, TName extends NameType = NameType> = Omit<UpstreamContentProps<TValue, TName>, 'content' | 'cursor'> & {
    content?: TooltipProps<TValue, TName>['content'];
    cursor?: CursorDefinition;
  };

  /** Tooltip's public props: content is a snippet where upstream takes an element or a component, and so is a custom cursor. */
  export type TooltipProps<TValue extends ValueType = ValueType, TName extends NameType = NameType> = Omit<UpstreamProps<TValue, TName>, 'content' | 'cursor'> & {
    content?: Snippet<[SvelteArgs<TooltipContentProps<TValue, TName>>]>;
    cursor?: CursorDefinition;
  };
</script>

<script lang="ts">
  import { getUniqPayload } from '../util/payload/getUniqPayload.js';
  import type { Coordinate } from '../util/types.js';
  import { rechartsProps } from '../util/svelteProps.js';
  import { useElementOffset } from '../util/useElementOffset.svelte.js';
  import { useViewBox } from '../context/chartLayoutContext.svelte.js';
  import { useAccessibilityLayer } from '../context/accessibilityContext.js';
  import { useTooltipPortal } from '../context/tooltipPortalContext.js';
  import { useAppDispatch, useAppSelector } from '../state/hooks.svelte.js';
  import { selectActiveCoordinate, selectActiveLabel, selectIsTooltipActive, selectTooltipPayload } from '../state/selectors/selectors.js';
  import { useTooltipEventType } from '../state/selectors/selectTooltipEventType.hooks.js';
  import { setTooltipSettingsState, type TooltipPayload } from '../state/tooltipSlice.js';
  import { useTooltipChartSynchronisation } from '../synchronisation/useChartSynchronisation.svelte.js';
  import Portal from '../util/Portal.svelte';
  import RenderProp from '../util/RenderProp.svelte';
  import { defaultTooltipProps, defaultUniqBy, emptyPayload } from './Tooltip.js';
  import TooltipBoundingBox from './TooltipBoundingBox.svelte';
  import DefaultTooltipContent from './DefaultTooltipContent.svelte';
  import Cursor from './Cursor.svelte';

  let raw: TooltipProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof defaultTooltipProps>(() => raw as UpstreamProps, defaultTooltipProps);
  const dispatch = useAppDispatch();
  const defaultIndexAsString: string | null | undefined = $derived(typeof resolved.defaultIndex === 'number' ? String(resolved.defaultIndex) : resolved.defaultIndex);

  $effect(() => {
    dispatch(
      setTooltipSettingsState({
        shared: resolved.shared,
        trigger: resolved.trigger,
        axisId: resolved.axisId,
        active: resolved.active,
        defaultIndex: defaultIndexAsString,
      }),
    );
  });

  const viewBox = useViewBox();
  const accessibilityLayer = useAccessibilityLayer();
  const tooltipEventType = useTooltipEventType(() => resolved.shared);

  const activeState = useAppSelector((state) => selectIsTooltipActive(state, tooltipEventType.current, resolved.trigger, defaultIndexAsString));
  const payloadFromRedux = useAppSelector((state) => selectTooltipPayload(state, tooltipEventType.current, resolved.trigger, defaultIndexAsString));
  const labelFromRedux = useAppSelector((state) => selectActiveLabel(state, tooltipEventType.current, resolved.trigger, defaultIndexAsString));
  const coordinate = useAppSelector((state): Coordinate | undefined => selectActiveCoordinate(state, tooltipEventType.current, resolved.trigger, defaultIndexAsString));
  const payload: TooltipPayload | undefined = $derived(payloadFromRedux.current);
  const tooltipPortalFromContext = useTooltipPortal();
  const activeIndex = $derived(activeState.current?.activeIndex);
  // The `active` prop wins over the chart's interaction state, so a Tooltip can be forced open or closed.
  const finalIsActive: boolean = $derived(resolved.active ?? activeState.current?.isActive ?? false);
  const [lastBoundingBox, updateBoundingBox] = useElementOffset(() => [payload, finalIsActive]);
  const finalLabel = $derived(tooltipEventType.current === 'axis' ? labelFromRedux.current : undefined);

  useTooltipChartSynchronisation(
    () => tooltipEventType.current,
    () => resolved.trigger,
    () => coordinate.current,
    () => finalLabel,
    () => activeIndex ?? undefined,
    () => finalIsActive,
  );

  const tooltipPortal = $derived(resolved.portal ?? tooltipPortalFromContext.current);
  // Upstream's wrapper commits before the chart's svg, so its portals come first; here the svg exists by now, so they go in front of it.
  const portalAnchor = $derived(resolved.portal ? null : (tooltipPortal?.querySelector(':scope > svg') ?? null));

  const finalPayload: TooltipPayload = $derived.by(() => {
    let result: TooltipPayload = payload ?? emptyPayload;
    if (!finalIsActive) {
      result = emptyPayload;
    }

    if (resolved.filterNull && result.length) {
      result = getUniqPayload(
        result.filter((entry) => entry.value != null && (entry.hide !== true || resolved.includeHidden)),
        resolved.payloadUniqBy,
        defaultUniqBy,
      );
    }
    return result;
  });
  const hasPayload = $derived(finalPayload.length > 0);

  const tooltipContentProps = $derived({
    ...resolved,
    payload: finalPayload,
    label: finalLabel,
    active: finalIsActive,
    activeIndex,
    coordinate: coordinate.current,
    accessibilityLayer: accessibilityLayer.current,
  } as unknown as TooltipContentProps);
</script>

{#if tooltipPortal != null && viewBox.current != null && tooltipEventType.current != null}<Portal target={tooltipPortal} anchor={portalAnchor}
    ><TooltipBoundingBox
      allowEscapeViewBox={resolved.allowEscapeViewBox}
      animationDuration={resolved.animationDuration}
      animationEasing={resolved.animationEasing}
      isAnimationActive={resolved.isAnimationActive}
      active={finalIsActive}
      coordinate={coordinate.current}
      {hasPayload}
      offset={resolved.offset}
      position={resolved.position}
      reverseDirection={resolved.reverseDirection}
      useTranslate3d={resolved.useTranslate3d}
      viewBox={viewBox.current}
      wrapperStyle={resolved.wrapperStyle}
      lastBoundingBox={lastBoundingBox.current}
      innerRef={updateBoundingBox}
      hasPortalFromProps={Boolean(resolved.portal)}
      >{#if typeof raw.content === 'function'}<RenderProp of={raw.content} props={tooltipContentProps} />{:else}<DefaultTooltipContent {...tooltipContentProps} />{/if}</TooltipBoundingBox
    ></Portal
  >{#if finalIsActive}<Cursor cursor={resolved.cursor as CursorDefinition} tooltipEventType={tooltipEventType.current} coordinate={coordinate.current} payload={finalPayload} index={activeIndex ?? undefined} />{/if}{/if}
