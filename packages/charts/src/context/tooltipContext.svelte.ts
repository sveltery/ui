import type * as React from '../react.js';
import type { DataKey } from '../util/types.js';
import { useAppDispatch, type Getter } from '../state/hooks.svelte.js';
import { mouseLeaveItem, setActiveClickItemIndex, setActiveMouseOverItemIndex } from '../state/tooltipSlice.js';
import type { MouseEnterLeaveEvent, TooltipTriggerInfo } from './tooltipContext.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- upstream's type, a dataKey of any data
type AnyDataKey = DataKey<any>;

// Upstream's hooks close over the props of the current render. The returned handlers run later, so they read the props through getters.

export const useMouseEnterItemDispatch = <T extends TooltipTriggerInfo, E extends SVGElement = SVGElement>(
  onMouseEnterFromProps: Getter<MouseEnterLeaveEvent<T, E> | undefined>,
  dataKey: Getter<AnyDataKey | undefined>,
  graphicalItemId: Getter<string>,
) => {
  const dispatch = useAppDispatch();
  return (data: T, index: number) => (event: React.MouseEvent<E>) => {
    onMouseEnterFromProps()?.(data, index, event);
    dispatch(
      setActiveMouseOverItemIndex({
        activeIndex: String(index),
        activeDataKey: dataKey(),
        activeCoordinate: data.tooltipPosition,
        activeGraphicalItemId: graphicalItemId(),
      }),
    );
  };
};

export const useMouseLeaveItemDispatch = <T extends TooltipTriggerInfo, E extends SVGElement = SVGElement>(
  onMouseLeaveFromProps: Getter<undefined | MouseEnterLeaveEvent<T, E>>,
) => {
  const dispatch = useAppDispatch();
  return (data: T, index: number) => (event: React.MouseEvent<E>) => {
    onMouseLeaveFromProps()?.(data, index, event);
    dispatch(mouseLeaveItem());
  };
};

export const useMouseClickItemDispatch = <T extends TooltipTriggerInfo, E extends SVGElement = SVGElement>(
  onMouseClickFromProps: Getter<MouseEnterLeaveEvent<T, E> | undefined>,
  dataKey: Getter<AnyDataKey | undefined>,
  graphicalItemId: Getter<string>,
) => {
  const dispatch = useAppDispatch();
  return (data: T, index: number) => (event: React.MouseEvent<E>) => {
    onMouseClickFromProps()?.(data, index, event);
    dispatch(
      setActiveClickItemIndex({
        activeIndex: String(index),
        activeDataKey: dataKey(),
        activeCoordinate: data.tooltipPosition,
        activeGraphicalItemId: graphicalItemId(),
      }),
    );
  };
};
