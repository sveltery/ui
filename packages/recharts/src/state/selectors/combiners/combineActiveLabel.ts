import { TickItem } from '../../../util/types.js';
import { TooltipIndex } from '../../tooltipSlice.js';
import { isNan } from '../../../util/DataUtils.js';
import { ActiveLabel } from '../../../synchronisation/types.js';

export const combineActiveLabel = (
  tooltipTicks: ReadonlyArray<TickItem> | undefined,
  activeIndex: TooltipIndex,
): ActiveLabel => {
  const n = Number(activeIndex);
  if (isNan(n) || activeIndex == null) {
    return undefined;
  }
  return n >= 0 ? tooltipTicks?.[n]?.value : undefined;
};
