import { createSelector } from 'reselect';
import { RechartsRootState } from '../store.js';
import { TooltipIndex, TooltipPayloadConfiguration } from '../tooltipSlice.js';
import { Coordinate } from '../../util/types.js';
import { selectTooltipState } from './selectTooltipState.js';
import { GraphicalItemId } from '../graphicalItemsSlice.js';

const selectAllTooltipPayloadConfiguration: (state: RechartsRootState) => ReadonlyArray<TooltipPayloadConfiguration> =
  createSelector([selectTooltipState], tooltipState => tooltipState.tooltipItemPayloads);

export const selectTooltipCoordinate: (
  state: RechartsRootState,
  tooltipIndex: TooltipIndex,
  graphicalItemId: GraphicalItemId,
) => Coordinate | undefined = createSelector(
  [
    selectAllTooltipPayloadConfiguration,
    (_state: RechartsRootState, tooltipIndex: TooltipIndex): TooltipIndex => tooltipIndex,
    (_state: RechartsRootState, _tooltipIndex: TooltipIndex, graphicalItemId: GraphicalItemId): GraphicalItemId =>
      graphicalItemId,
  ],
  (
    allTooltipConfigurations: ReadonlyArray<TooltipPayloadConfiguration>,
    tooltipIndex: TooltipIndex,
    graphicalItemId: GraphicalItemId,
  ): Coordinate | undefined => {
    if (tooltipIndex == null) {
      return undefined;
    }
    const mostRelevantTooltipConfiguration = allTooltipConfigurations.find(tooltipConfiguration => {
      return tooltipConfiguration.settings.graphicalItemId === graphicalItemId;
    });
    if (mostRelevantTooltipConfiguration == null) {
      return undefined;
    }
    const { getPosition } = mostRelevantTooltipConfiguration;
    if (getPosition == null) {
      return undefined;
    }
    return getPosition(tooltipIndex);
  },
);
