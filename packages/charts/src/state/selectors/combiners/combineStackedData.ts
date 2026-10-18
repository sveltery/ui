import { AllStackGroups, StackGroup, StackSeries } from '../../../util/stacks/stackTypes.js';
import { MaybeStackedGraphicalItem } from '../../types/StackedGraphicalItem.js';
import { getStackSeriesIdentifier } from '../../../util/stacks/getStackSeriesIdentifier.js';

export const combineStackedData = (
  stackGroups: AllStackGroups | undefined,
  barSettings: MaybeStackedGraphicalItem | undefined,
): StackSeries | undefined => {
  const stackSeriesIdentifier = getStackSeriesIdentifier(barSettings);
  if (!stackGroups || stackSeriesIdentifier == null || barSettings == null) {
    return undefined;
  }
  const { stackId } = barSettings;
  if (stackId == null) {
    return undefined;
  }
  const stackGroup: StackGroup | undefined = stackGroups[stackId];
  if (!stackGroup) {
    return undefined;
  }
  const { stackedData }: StackGroup = stackGroup;
  if (!stackedData) {
    return undefined;
  }
  return stackedData.find(sd => sd.key === stackSeriesIdentifier);
};
