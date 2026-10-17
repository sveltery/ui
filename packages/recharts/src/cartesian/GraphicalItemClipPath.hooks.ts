import type { AxisId } from '../state/cartesianAxisSlice.js';
import { useAppSelector, type Box, type Getter } from '../state/hooks.svelte.js';
import { implicitXAxis, implicitYAxis, selectXAxisSettings, selectYAxisSettings } from '../state/selectors/axisSelectors.js';

export function useNeedsClip(xAxisId: Getter<AxisId>, yAxisId: Getter<AxisId>): Box<{ needClip: boolean; needClipX: boolean; needClipY: boolean }> {
  const xAxis = useAppSelector((state) => selectXAxisSettings(state, xAxisId()));
  const yAxis = useAppSelector((state) => selectYAxisSettings(state, yAxisId()));
  return {
    get current() {
      const needClipX: boolean = xAxis.current?.allowDataOverflow ?? implicitXAxis.allowDataOverflow;
      const needClipY: boolean = yAxis.current?.allowDataOverflow ?? implicitYAxis.allowDataOverflow;
      const needClip = needClipX || needClipY;
      return { needClip, needClipX, needClipY };
    },
  };
}
