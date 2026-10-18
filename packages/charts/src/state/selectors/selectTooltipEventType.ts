import { RechartsRootState } from '../store.js';
import { TooltipEventType } from '../../util/types.js';
import { SharedTooltipSettings } from '../tooltipSlice.js';

export const selectDefaultTooltipEventType = (state: RechartsRootState): TooltipEventType =>
  state.options.defaultTooltipEventType;
export const selectValidateTooltipEventTypes = (
  state: RechartsRootState,
): ReadonlyArray<TooltipEventType> | undefined => state.options.validateTooltipEventTypes;

export function combineTooltipEventType(
  shared: SharedTooltipSettings,
  defaultTooltipEventType: TooltipEventType,
  validateTooltipEventTypes: ReadonlyArray<TooltipEventType> | undefined,
): TooltipEventType {
  if (shared == null) {
    return defaultTooltipEventType;
  }
  const eventType = shared ? 'axis' : 'item';
  if (validateTooltipEventTypes == null) {
    return defaultTooltipEventType;
  }
  return validateTooltipEventTypes.includes(eventType) ? eventType : defaultTooltipEventType;
}

export function selectTooltipEventType(state: RechartsRootState, shared: SharedTooltipSettings): TooltipEventType {
  const defaultTooltipEventType = selectDefaultTooltipEventType(state);
  const validateTooltipEventTypes = selectValidateTooltipEventTypes(state);
  return combineTooltipEventType(shared, defaultTooltipEventType, validateTooltipEventTypes);
}
