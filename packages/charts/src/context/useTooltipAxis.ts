import { useAppSelector, type Box } from '../state/hooks.svelte.js';
import { getBandSizeOfAxis } from '../util/ChartUtils.js';
import { selectTooltipAxis, type RenderableAxisSettings } from '../state/selectors/axisSelectors.js';
import { selectTooltipAxisScale, selectTooltipAxisTicks } from '../state/selectors/tooltipSelectors.js';

export const useTooltipAxis = (): Box<RenderableAxisSettings | undefined> => useAppSelector(selectTooltipAxis);

export const useTooltipAxisBandSize = (): Box<number | undefined> => {
  const tooltipAxis = useTooltipAxis();
  const tooltipTicks = useAppSelector(selectTooltipAxisTicks);
  const tooltipAxisScale = useAppSelector(selectTooltipAxisScale);
  return {
    get current() {
      if (!tooltipAxis.current || !tooltipAxisScale.current) {
        return getBandSizeOfAxis(undefined, tooltipTicks.current);
      }
      return getBandSizeOfAxis({ ...tooltipAxis.current, scale: tooltipAxisScale.current }, tooltipTicks.current);
    },
  };
};
