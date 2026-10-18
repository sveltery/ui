import type { PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector, type Getter } from '../state/hooks.svelte.js';
import { selectEventEmitter, selectSyncId, selectSyncMethod } from '../state/selectors/rootPropsSelectors.js';
import { BRUSH_SYNC_EVENT, eventCenter, TOOLTIP_SYNC_EVENT } from '../util/Events.js';
import { createEventEmitter } from '../state/optionsSlice.js';
import { setSyncInteraction, type TooltipIndex, type TooltipSyncState } from '../state/tooltipSlice.js';
import { selectTooltipDataKey } from '../state/selectors/selectors.js';
import type { Coordinate, TickItem, TooltipEventType } from '../util/types.js';
import type { TooltipTrigger } from '../chart/types.js';
import { selectActiveTooltipGraphicalItemId, selectTooltipAxisTicks } from '../state/selectors/tooltipSelectors.js';
import { selectSynchronisedTooltipState } from './syncSelectors.js';
import { useChartLayout, useViewBox } from '../context/chartLayoutContext.svelte.js';
import type { BrushStartEndIndex } from '../context/brushUpdateContext.js';
import { setDataStartEndIndexes } from '../state/chartDataSlice.js';
import type { ActiveLabel, MouseHandlerDataParam } from './types.js';

function useTooltipSyncEventsListener() {
  const mySyncId = useAppSelector(selectSyncId);
  const myEventEmitter = useAppSelector(selectEventEmitter);
  const dispatch = useAppDispatch();
  const syncMethodBox = useAppSelector(selectSyncMethod);
  const tooltipTicksBox = useAppSelector(selectTooltipAxisTicks);
  const layoutBox = useChartLayout();
  const viewBoxBox = useViewBox();
  const className = useAppSelector((state) => state.rootProps.className);

  $effect(() => {
    const syncId = mySyncId.current;
    const emitterSymbol = myEventEmitter.current;
    const syncMethod = syncMethodBox.current;
    const tooltipTicks = tooltipTicksBox.current;
    const layout = layoutBox.current;
    const viewBox = viewBoxBox.current;
    // Upstream re-subscribes when the chart's className changes, so this does too.
    void className.current;
    if (syncId == null) {
      // This chart is not synchronised with any other chart so we don't need to listen for any events.
      return;
    }

    const listener = (incomingSyncId: number | string, action: PayloadAction<TooltipSyncState>, emitter: symbol) => {
      if (emitterSymbol === emitter) {
        // We don't want to dispatch actions that we sent ourselves.
        return;
      }
      if (syncId !== incomingSyncId) {
        // This event is not for this chart
        return;
      }
      if (syncMethod === 'index') {
        if (viewBox && action?.payload?.coordinate && action.payload.sourceViewBox) {
          const { x, y, ...otherCoordinateProps } = action.payload.coordinate;
          const { x: sourceX, y: sourceY, width: sourceWidth, height: sourceHeight } = action.payload.sourceViewBox;

          const scaledCoordinate = {
            ...otherCoordinateProps,
            x: viewBox.x + (sourceWidth ? (x - sourceX) / sourceWidth : 0) * viewBox.width,
            y: viewBox.y + (sourceHeight ? (y - sourceY) / sourceHeight : 0) * viewBox.height,
          };

          dispatch({
            ...action,
            payload: {
              ...action.payload,
              coordinate: scaledCoordinate,
            },
          });
        } else {
          dispatch(action);
        }
        return;
      }

      if (tooltipTicks == null) {
        // for the other two sync methods, we need the ticks to be available
        return;
      }

      let activeTick: TickItem | undefined;
      if (typeof syncMethod === 'function') {
        // The 2.x CategoricalChartState shape, kept for compatibility.
        const syncMethodParam: MouseHandlerDataParam = {
          activeTooltipIndex: action.payload.index == null ? undefined : Number(action.payload.index),
          isTooltipActive: action.payload.active,
          activeIndex: action.payload.index == null ? undefined : Number(action.payload.index),
          activeLabel: action.payload.label,
          activeDataKey: action.payload.dataKey,
          activeCoordinate: action.payload.coordinate,
        };
        const activeTooltipIndex = syncMethod(tooltipTicks, syncMethodParam);
        activeTick = tooltipTicks[activeTooltipIndex];
      } else if (syncMethod === 'value') {
        // labels are always strings, tick.value might be a string or a number, depending on axis type
        activeTick = tooltipTicks.find((tick) => String(tick.value) === action.payload.label);
      }

      const { coordinate } = action.payload;

      if (activeTick == null || action.payload.active === false || coordinate == null || viewBox == null) {
        dispatch(
          setSyncInteraction({
            active: false,
            coordinate: undefined,
            dataKey: undefined,
            index: null,
            label: undefined,
            sourceViewBox: undefined,
            graphicalItemId: undefined,
          }),
        );
        return;
      }

      const { x, y } = coordinate;
      const validateChartX = Math.min(x, viewBox.x + viewBox.width);
      const validateChartY = Math.min(y, viewBox.y + viewBox.height);
      const activeCoordinate: Coordinate = {
        x: layout === 'horizontal' ? activeTick.coordinate : validateChartX,
        y: layout === 'horizontal' ? validateChartY : activeTick.coordinate,
      };

      const syncAction = setSyncInteraction({
        active: action.payload.active,
        coordinate: activeCoordinate,
        dataKey: action.payload.dataKey,
        index: String(activeTick.index),
        label: action.payload.label,
        sourceViewBox: action.payload.sourceViewBox,
        graphicalItemId: action.payload.graphicalItemId,
      });
      dispatch(syncAction);
    };
    eventCenter.on(TOOLTIP_SYNC_EVENT, listener);

    return () => {
      eventCenter.off(TOOLTIP_SYNC_EVENT, listener);
    };
  });
}

function useBrushSyncEventsListener() {
  const mySyncId = useAppSelector(selectSyncId);
  const myEventEmitter = useAppSelector(selectEventEmitter);
  const dispatch = useAppDispatch();
  $effect(() => {
    const syncId = mySyncId.current;
    const emitterSymbol = myEventEmitter.current;
    if (syncId == null) {
      // This chart is not synchronised with any other chart so we don't need to listen for any events.
      return;
    }

    const listener = (incomingSyncId: number | string, action: BrushStartEndIndex, emitter: symbol) => {
      if (emitterSymbol === emitter) {
        // We don't want to dispatch actions that we sent ourselves.
        return;
      }
      if (syncId === incomingSyncId) {
        dispatch(setDataStartEndIndexes(action));
      }
    };
    eventCenter.on(BRUSH_SYNC_EVENT, listener);

    return () => {
      eventCenter.off(BRUSH_SYNC_EVENT, listener);
    };
  });
}

/**
 * Receives synchronisation events from other charts. Must be called during component initialisation.
 * Reads syncMethod from state and decides how to synchronise the tooltip based on that.
 */
export function useSynchronisedEventsFromOtherCharts(): void {
  const dispatch = useAppDispatch();
  $effect(() => {
    dispatch(createEventEmitter());
  });

  useTooltipSyncEventsListener();
  useBrushSyncEventsListener();
}

/**
 * Sends events to other charts. If syncId is undefined, no events are sent. Must be called during component initialisation.
 * This ignores the syncMethod, because that is set and computed on the receiving end.
 */
export function useTooltipChartSynchronisation(
  tooltipEventType: Getter<TooltipEventType | undefined>,
  trigger: Getter<TooltipTrigger>,
  activeCoordinate: Getter<Coordinate | undefined>,
  activeLabel: Getter<ActiveLabel>,
  activeIndex: Getter<TooltipIndex | undefined>,
  isTooltipActive: Getter<boolean>,
): void {
  const activeDataKey = useAppSelector((state) => selectTooltipDataKey(state, tooltipEventType(), trigger()));
  const activeGraphicalItemId = useAppSelector(selectActiveTooltipGraphicalItemId);
  const eventEmitterSymbol = useAppSelector(selectEventEmitter);
  const syncId = useAppSelector(selectSyncId);
  const syncMethod = useAppSelector(selectSyncMethod);
  const tooltipState = useAppSelector(selectSynchronisedTooltipState);
  const viewBox = useViewBox();

  $effect(() => {
    const isReceivingSynchronisation = tooltipState.current?.active;
    const label = activeLabel();
    const action = {
      active: isTooltipActive(),
      coordinate: activeCoordinate(),
      dataKey: activeDataKey.current,
      index: activeIndex(),
      label: typeof label === 'number' ? String(label) : label,
      sourceViewBox: viewBox.current,
      graphicalItemId: activeGraphicalItemId.current,
    };
    const id = syncId.current;
    const emitterSymbol = eventEmitterSymbol.current;
    // Upstream re-sends when syncMethod changes, so this does too.
    void syncMethod.current;
    if (isReceivingSynchronisation) {
      // Do not echo a tooltip that another chart is driving, or the charts loop forever.
      return;
    }
    if (id == null) {
      // syncId is not set, means that this chart is not synchronised with any other chart.
      return;
    }
    if (emitterSymbol == null) {
      // Outside a chart these are undefined; return silently instead of throwing.
      return;
    }
    eventCenter.emit(TOOLTIP_SYNC_EVENT, id, setSyncInteraction(action), emitterSymbol);
  });
}

export function useBrushChartSynchronisation(): void {
  const syncId = useAppSelector(selectSyncId);
  const eventEmitterSymbol = useAppSelector(selectEventEmitter);
  const brushStartIndex = useAppSelector((state) => state.chartData.dataStartIndex);
  const brushEndIndex = useAppSelector((state) => state.chartData.dataEndIndex);

  $effect(() => {
    const id = syncId.current;
    const startIndex = brushStartIndex.current;
    const endIndex = brushEndIndex.current;
    const emitterSymbol = eventEmitterSymbol.current;
    if (id == null || startIndex == null || endIndex == null || emitterSymbol == null) {
      return;
    }
    const syncAction: BrushStartEndIndex = { startIndex, endIndex };
    eventCenter.emit(BRUSH_SYNC_EVENT, id, syncAction, emitterSymbol);
  });
}
