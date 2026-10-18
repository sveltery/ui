<script lang="ts">
  import type { Snippet } from 'svelte';
  import { clsx } from 'clsx';
  import type { CSSProperties, KeyboardEvent, MouseEvent, TouchEvent } from '../react.js';
  import type { Percent } from '../util/types.js';
  import type { ExternalMouseEvents } from './types.js';
  import { mouseLeaveChart } from '../state/tooltipSlice.js';
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { mouseClickAction, mouseMoveAction } from '../state/mouseEventsMiddleware.js';
  import { focusAction, keyDownAction, blurAction } from '../state/keyboardEventsMiddleware.js';
  import { externalEventAction } from '../state/externalEventsMiddleware.js';
  import { touchEventAction } from '../state/touchEventsMiddleware.js';
  import { useReportScale } from '../util/useReportScale.svelte.js';
  import { setTooltipPortalContext } from '../context/tooltipPortalContext.js';
  import { setLegendPortalContext } from '../context/legendPortalContext.js';
  import { useResponsiveContainerContext } from '../component/ResponsiveContainer.hooks.js';
  import EventSynchronizer from './EventSynchronizer.svelte';
  import RechartsWrapperDiv, { type WrapperDivMode } from './RechartsWrapperDiv.svelte';

  type RechartsWrapperProps = ExternalMouseEvents & {
    children: Snippet;
    width: number | Percent | undefined;
    height: number | Percent | undefined;
    /** If true, it follows container size changes; if false, it renders at the given width and height and stays that way. */
    responsive: boolean;
    className?: string;
    style?: CSSProperties;
    /**
     * Treemap handles its own mouse events, so false disables click and touch dispatching.
     * Mouse move events are still dispatched because tooltip synchronisation needs them.
     * @default true
     */
    dispatchTouchEvents?: boolean;
  };

  let {
    children,
    className,
    height: heightFromProps,
    onClick,
    onContextMenu,
    onDoubleClick,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onMouseUp,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    style,
    width: widthFromProps,
    responsive,
    dispatchTouchEvents = true,
  }: RechartsWrapperProps = $props();

  const dispatch = useAppDispatch();
  let tooltipPortal = $state<HTMLElement | null>(null);
  let legendPortal = $state<HTMLElement | null>(null);
  setTooltipPortalContext({
    get current() {
      return tooltipPortal;
    },
  });
  setLegendPortalContext({
    get current() {
      return legendPortal;
    },
  });

  const setScaleRef = useReportScale();

  const responsiveContainerCalculations = useResponsiveContainerContext();
  const width = $derived(responsiveContainerCalculations.current.width > 0 ? responsiveContainerCalculations.current.width : widthFromProps);
  const height = $derived(responsiveContainerCalculations.current.height > 0 ? responsiveContainerCalculations.current.height : heightFromProps);

  function innerRef(node: HTMLDivElement | null) {
    setScaleRef(node);
    tooltipPortal = node;
    legendPortal = node;
  }

  const myOnClick = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(mouseClickAction(e));
    dispatch(externalEventAction({ handler: onClick, reactEvent: e }));
  };

  const myOnMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(mouseMoveAction(e));
    dispatch(externalEventAction({ handler: onMouseEnter, reactEvent: e }));
  };

  const myOnMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(mouseLeaveChart());
    dispatch(externalEventAction({ handler: onMouseLeave, reactEvent: e }));
  };

  const myOnMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(mouseMoveAction(e));
    dispatch(externalEventAction({ handler: onMouseMove, reactEvent: e }));
  };

  const onFocus = () => {
    dispatch(focusAction());
  };

  const onBlur = () => {
    dispatch(blurAction());
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    dispatch(keyDownAction(e.key));
  };

  const myOnContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(externalEventAction({ handler: onContextMenu, reactEvent: e }));
  };

  const myOnDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(externalEventAction({ handler: onDoubleClick, reactEvent: e }));
  };

  const myOnMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(externalEventAction({ handler: onMouseDown, reactEvent: e }));
  };

  const myOnMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(externalEventAction({ handler: onMouseUp, reactEvent: e }));
  };

  const myOnTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    dispatch(externalEventAction({ handler: onTouchStart, reactEvent: e }));
  };

  // Touch has no enter and leave, so the touched element is found from the touch point (elementFromPoint).
  const myOnTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (dispatchTouchEvents) {
      dispatch(touchEventAction(e));
    }
    dispatch(externalEventAction({ handler: onTouchMove, reactEvent: e }));
  };

  const myOnTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    dispatch(externalEventAction({ handler: onTouchEnd, reactEvent: e }));
  };

  const divWidth = $derived(width ?? style?.width);
  const divHeight = $derived(height ?? style?.height);
  // Upstream switches wrapper components when the mode changes, which remounts the div and the chart inside it.
  const mode: WrapperDivMode = $derived.by(() => {
    if (responsive) return 'responsive';
    if (typeof divWidth === 'string' || typeof divHeight === 'string') return 'readOnce';
    if (typeof divWidth === 'number' && typeof divHeight === 'number') return 'static';
    return 'none';
  });
</script>

{#key mode}
  <RechartsWrapperDiv
    {mode}
    {innerRef}
    width={divWidth}
    height={divHeight}
    className={clsx('recharts-wrapper', className)}
    style={{ position: 'relative', cursor: 'default', width, height, ...style }}
    onClick={myOnClick}
    onContextMenu={myOnContextMenu}
    onDoubleClick={myOnDoubleClick}
    {onFocus}
    {onBlur}
    {onKeyDown}
    onMouseDown={myOnMouseDown}
    onMouseEnter={myOnMouseEnter}
    onMouseLeave={myOnMouseLeave}
    onMouseMove={myOnMouseMove}
    onMouseUp={myOnMouseUp}
    onTouchEnd={myOnTouchEnd}
    onTouchMove={myOnTouchMove}
    onTouchStart={myOnTouchStart}
  >
    <EventSynchronizer />{@render children()}
  </RechartsWrapperDiv>
{/key}
