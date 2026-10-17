import type { TooltipEventType } from '../../util/types.js';
import { useAppSelector, type Box, type Getter } from '../hooks.svelte.js';
import type { SharedTooltipSettings } from '../tooltipSlice.js';
import { selectTooltipEventType } from './selectTooltipEventType.js';

export function useTooltipEventType(shared: Getter<SharedTooltipSettings>): Box<TooltipEventType | undefined> {
  return useAppSelector((state) => selectTooltipEventType(state, shared()));
}
