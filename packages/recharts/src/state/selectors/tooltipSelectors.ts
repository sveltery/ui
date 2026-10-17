import { createSelector } from 'reselect';
import { RechartsRootState } from '../store.js';
import {
  AxisRange,
  combineAppliedValues,
  combineAreasDomain,
  combineAxisDomain,
  combineAxisDomainWithNiceTicks,
  combineCategoricalDomain,
  combineDisplayedData,
  combineDomainOfAllAppliedNumericalValuesIncludingErrorValues,
  combineDomainOfStackGroups,
  combineDotsDomain,
  combineDuplicateDomain,
  combineGraphicalItemsData,
  combineGraphicalItemsSettings,
  combineLinesDomain,
  combineNiceTicks,
  combineNumericalDomain,
  combineStackGroups,
  filterGraphicalNotStackedItems,
  filterReferenceElements,
  getDomainDefinition,
  itemAxisPredicate,
  mergeDomains,
  RenderableAxisSettings,
  selectAllErrorBarSettings,
  selectAxisRange,
  selectHasBar,
  selectReferenceAreas,
  selectReferenceDots,
  selectReferenceLines,
  selectTooltipAxis,
  selectTooltipAxisDataKey,
} from './axisSelectors.js';
import { selectChartLayout } from '../../context/chartLayoutContext.js';
import { isCategoricalAxis, StackId } from '../../util/ChartUtils.js';
import {
  AxisDomain,
  CategoricalDomain,
  CategoricalDomainItem,
  Coordinate,
  RechartsScaleType,
  DataKey,
  LayoutType,
  NumberDomain,
  TickItem,
  TooltipEventType,
} from '../../util/types.js';
import { AppliedChartData, ChartData } from '../chartDataSlice.js';
import { selectChartDataWithIndexes } from './dataSelectors.js';
import {
  CartesianGraphicalItemSettings,
  GraphicalItemSettings,
  PolarGraphicalItemSettings,
} from '../graphicalItemsSlice.js';
import { ReferenceAreaSettings, ReferenceDotSettings, ReferenceLineSettings } from '../referenceElementsSlice.js';
import { selectChartName, selectReverseStackOrder, selectStackOffsetType } from './rootPropsSelectors.js';
import { isNotNil, mathSign } from '../../util/DataUtils.js';
import { combineAxisRangeWithReverse } from './combiners/combineAxisRangeWithReverse.js';
import { TooltipIndex, TooltipInteractionState, TooltipPayload, TooltipSettingsState } from '../tooltipSlice.js';

import {
  combineTooltipEventType,
  selectDefaultTooltipEventType,
  selectValidateTooltipEventTypes,
} from './selectTooltipEventType.js';

import { combineActiveLabel } from './combiners/combineActiveLabel.js';

import { selectTooltipSettings } from './selectTooltipSettings.js';

import { combineTooltipInteractionState } from './combiners/combineTooltipInteractionState.js';
import { combineActiveTooltipIndex } from './combiners/combineActiveTooltipIndex.js';
import { combineCoordinateForDefaultIndex } from './combiners/combineCoordinateForDefaultIndex.js';
import { selectChartHeight, selectChartWidth } from './containerSelectors.js';
import { selectChartOffsetInternal } from './selectChartOffsetInternal.js';
import { combineTooltipPayloadConfigurations } from './combiners/combineTooltipPayloadConfigurations.js';
import { selectTooltipPayloadSearcher } from './selectTooltipPayloadSearcher.js';
import { selectTooltipState } from './selectTooltipState.js';

import { combineTooltipPayload } from './combiners/combineTooltipPayload.js';
import { StackGroup } from '../../util/stacks/stackTypes.js';
import { selectTooltipAxisId } from './selectTooltipAxisId.js';
import { RenderableAxisType, selectTooltipAxisType } from './selectTooltipAxisType.js';
import { combineDisplayedStackedData, DisplayedStackedData } from './combiners/combineDisplayedStackedData.js';
import { DefinitelyStackedGraphicalItem, isStacked } from '../types/StackedGraphicalItem.js';
import { numericalDomainSpecifiedWithoutRequiringData } from '../../util/isDomainSpecifiedByUser.js';
import { numberDomainEqualityCheck } from './numberDomainEqualityCheck.js';
import { emptyArraysAreEqualCheck } from './arrayEqualityCheck.js';
import { ActiveLabel } from '../../synchronisation/types.js';
import { RechartsScale, rechartsScaleFactory } from '../../util/scale/RechartsScale.js';
import { isWellBehavedNumber } from '../../util/isWellBehavedNumber.js';
import { combineRealScaleType } from './combiners/combineRealScaleType.js';
import { combineConfiguredScale } from './combiners/combineConfiguredScale.js';
import { CustomScaleDefinition } from '../../util/scale/CustomScaleDefinition.js';

export const selectTooltipAxisRealScaleType: (state: RechartsRootState) => RechartsScaleType | undefined =
  createSelector([selectTooltipAxis, selectHasBar, selectChartName], combineRealScaleType);

export const selectAllUnfilteredGraphicalItems: (
  state: RechartsRootState,
) => ReadonlyArray<CartesianGraphicalItemSettings | PolarGraphicalItemSettings> = createSelector(
  [
    (state: RechartsRootState) => state.graphicalItems.cartesianItems,
    (state: RechartsRootState) => state.graphicalItems.polarItems,
  ],
  (cartesianItems, polarItems) => [...cartesianItems, ...polarItems],
);

const selectTooltipAxisPredicate = createSelector([selectTooltipAxisType, selectTooltipAxisId], itemAxisPredicate);

export const selectAllGraphicalItemsSettings: (state: RechartsRootState) => ReadonlyArray<GraphicalItemSettings> =
  createSelector(
    [selectAllUnfilteredGraphicalItems, selectTooltipAxis, selectTooltipAxisPredicate],
    combineGraphicalItemsSettings,
    {
      memoizeOptions: {
        resultEqualityCheck: emptyArraysAreEqualCheck,
      },
    },
  );

const selectAllStackedGraphicalItemsSettings: (
  state: RechartsRootState,
) => ReadonlyArray<DefinitelyStackedGraphicalItem> = createSelector(
  [selectAllGraphicalItemsSettings],
  (graphicalItems: ReadonlyArray<GraphicalItemSettings>): ReadonlyArray<DefinitelyStackedGraphicalItem> =>
    graphicalItems.filter(isStacked),
);

export const selectTooltipGraphicalItemsData = createSelector(
  [selectAllGraphicalItemsSettings],
  combineGraphicalItemsData,
  {
    memoizeOptions: {
      resultEqualityCheck: emptyArraysAreEqualCheck,
    },
  },
);

/**
 * Data for tooltip always use the data with indexes set by a Brush,
 * and never accept the isPanorama flag:
 * because Tooltip never displays inside the panorama anyway
 * so we don't need to worry what would happen there.
 */
export const selectTooltipDisplayedData: (state: RechartsRootState) => ChartData = createSelector(
  [selectTooltipGraphicalItemsData, selectChartDataWithIndexes],
  combineDisplayedData,
);

const selectTooltipStackedData: (state: RechartsRootState) => DisplayedStackedData = createSelector(
  [selectAllStackedGraphicalItemsSettings, selectChartDataWithIndexes, selectTooltipAxis],
  combineDisplayedStackedData,
);

const selectAllTooltipAppliedValues: (state: RechartsRootState) => AppliedChartData = createSelector(
  [selectTooltipDisplayedData, selectTooltipAxis, selectAllGraphicalItemsSettings],
  combineAppliedValues,
);

const selectTooltipAxisDomainDefinition: (state: RechartsRootState) => AxisDomain | undefined = createSelector(
  [selectTooltipAxis],
  getDomainDefinition,
);

const selectTooltipDataOverflow: (state: RechartsRootState) => boolean = createSelector(
  [selectTooltipAxis],
  axisSettings => axisSettings.allowDataOverflow,
);

const selectTooltipDomainFromUserPreferences: (state: RechartsRootState) => NumberDomain | undefined = createSelector(
  [selectTooltipAxisDomainDefinition, selectTooltipDataOverflow],
  numericalDomainSpecifiedWithoutRequiringData,
);

const selectAllStackedGraphicalItems: (state: RechartsRootState) => ReadonlyArray<DefinitelyStackedGraphicalItem> =
  createSelector([selectAllGraphicalItemsSettings], (graphicalItems: ReadonlyArray<GraphicalItemSettings>) =>
    graphicalItems.filter(isStacked),
  );

const selectTooltipStackGroups: (state: RechartsRootState) => Record<StackId, StackGroup> = createSelector(
  [selectTooltipStackedData, selectAllStackedGraphicalItems, selectStackOffsetType, selectReverseStackOrder],
  combineStackGroups,
);

const selectTooltipDomainOfStackGroups: (state: RechartsRootState) => NumberDomain | undefined = createSelector(
  [selectTooltipStackGroups, selectChartDataWithIndexes, selectTooltipAxisType, selectTooltipDomainFromUserPreferences],
  combineDomainOfStackGroups,
);

const selectTooltipItemsSettingsExceptStacked: (state: RechartsRootState) => ReadonlyArray<GraphicalItemSettings> =
  createSelector([selectAllGraphicalItemsSettings], filterGraphicalNotStackedItems);

const selectDomainOfAllAppliedNumericalValuesIncludingErrorValues: (
  state: RechartsRootState,
) => NumberDomain | undefined = createSelector(
  [
    selectTooltipDisplayedData,
    selectTooltipAxis,
    selectTooltipItemsSettingsExceptStacked,
    selectAllErrorBarSettings,
    selectTooltipAxisType,
  ],
  combineDomainOfAllAppliedNumericalValuesIncludingErrorValues,
  {
    memoizeOptions: {
      resultEqualityCheck: numberDomainEqualityCheck,
    },
  },
);

const selectReferenceDotsByTooltipAxis: (state: RechartsRootState) => ReadonlyArray<ReferenceDotSettings> | undefined =
  createSelector([selectReferenceDots, selectTooltipAxisType, selectTooltipAxisId], filterReferenceElements);

const selectTooltipReferenceDotsDomain: (state: RechartsRootState) => NumberDomain | undefined = createSelector(
  [selectReferenceDotsByTooltipAxis, selectTooltipAxisType],
  combineDotsDomain,
);

const selectReferenceAreasByTooltipAxis: (
  state: RechartsRootState,
) => ReadonlyArray<ReferenceAreaSettings> | undefined = createSelector(
  [selectReferenceAreas, selectTooltipAxisType, selectTooltipAxisId],
  filterReferenceElements,
);

const selectTooltipReferenceAreasDomain: (state: RechartsRootState) => NumberDomain | undefined = createSelector(
  [selectReferenceAreasByTooltipAxis, selectTooltipAxisType],
  combineAreasDomain,
);

const selectReferenceLinesByTooltipAxis: (
  state: RechartsRootState,
) => ReadonlyArray<ReferenceLineSettings> | undefined = createSelector(
  [selectReferenceLines, selectTooltipAxisType, selectTooltipAxisId],
  filterReferenceElements,
);

const selectTooltipReferenceLinesDomain: (state: RechartsRootState) => NumberDomain | undefined = createSelector(
  [selectReferenceLinesByTooltipAxis, selectTooltipAxisType],
  combineLinesDomain,
);

const selectTooltipReferenceElementsDomain: (state: RechartsRootState) => NumberDomain | undefined = createSelector(
  [selectTooltipReferenceDotsDomain, selectTooltipReferenceLinesDomain, selectTooltipReferenceAreasDomain],
  mergeDomains,
);

const selectTooltipNumericalDomain: (state: RechartsRootState) => NumberDomain | undefined = createSelector(
  [
    selectTooltipAxis,
    selectTooltipAxisDomainDefinition,
    selectTooltipDomainFromUserPreferences,
    selectTooltipDomainOfStackGroups,
    selectDomainOfAllAppliedNumericalValuesIncludingErrorValues,
    selectTooltipReferenceElementsDomain,
    selectChartLayout,
    selectTooltipAxisType,
  ],
  combineNumericalDomain,
);

export const selectTooltipAxisDomain: (state: RechartsRootState) => NumberDomain | CategoricalDomain | undefined =
  createSelector(
    [
      selectTooltipAxis,
      selectChartLayout,
      selectTooltipDisplayedData,
      selectAllTooltipAppliedValues,
      selectStackOffsetType,
      selectTooltipAxisType,
      selectTooltipNumericalDomain,
    ],
    combineAxisDomain,
  );

const selectTooltipNiceTicks: (state: RechartsRootState) => ReadonlyArray<number> | undefined = createSelector(
  [selectTooltipAxisDomain, selectTooltipAxis, selectTooltipAxisRealScaleType],
  combineNiceTicks,
);

export const selectTooltipAxisDomainIncludingNiceTicks: (
  state: RechartsRootState,
) => NumberDomain | CategoricalDomain | undefined = createSelector(
  [selectTooltipAxis, selectTooltipAxisDomain, selectTooltipNiceTicks, selectTooltipAxisType],
  combineAxisDomainWithNiceTicks,
);

const selectTooltipAxisRange = (state: RechartsRootState): AxisRange | undefined => {
  const axisType = selectTooltipAxisType(state);
  const axisId = selectTooltipAxisId(state);
  const isPanorama = false; // Tooltip never displays in panorama so this is safe to assume
  return selectAxisRange(state, axisType, axisId, isPanorama);
};

export const selectTooltipAxisRangeWithReverse: (state: RechartsRootState) => AxisRange | undefined = createSelector(
  [selectTooltipAxis, selectTooltipAxisRange],
  combineAxisRangeWithReverse,
);

const selectTooltipConfiguredScale: (state: RechartsRootState) => CustomScaleDefinition | undefined = createSelector(
  [
    selectTooltipAxis,
    selectTooltipAxisRealScaleType,
    selectTooltipAxisDomainIncludingNiceTicks,
    selectTooltipAxisRangeWithReverse,
  ],
  combineConfiguredScale,
);

export const selectTooltipAxisScale: (state: RechartsRootState) => RechartsScale | undefined = createSelector(
  [selectTooltipConfiguredScale],
  rechartsScaleFactory,
);

const selectTooltipDuplicateDomain: (state: RechartsRootState) => ReadonlyArray<unknown> | undefined = createSelector(
  [selectChartLayout, selectAllTooltipAppliedValues, selectTooltipAxis, selectTooltipAxisType],
  combineDuplicateDomain,
);

export const selectTooltipCategoricalDomain: (state: RechartsRootState) => ReadonlyArray<unknown> | undefined =
  createSelector(
    [selectChartLayout, selectAllTooltipAppliedValues, selectTooltipAxis, selectTooltipAxisType],
    combineCategoricalDomain,
  );

const combineTicksOfTooltipAxis = (
  layout: LayoutType,
  axis: RenderableAxisSettings,
  realScaleType: string | undefined,
  scale: RechartsScale | undefined,
  range: AxisRange | undefined,
  duplicateDomain: ReadonlyArray<unknown> | undefined,
  categoricalDomain: ReadonlyArray<unknown> | undefined,
  axisType: RenderableAxisType,
): ReadonlyArray<TickItem> | undefined => {
  if (!axis) {
    return undefined;
  }
  const { type } = axis;

  const isCategorical = isCategoricalAxis(layout, axisType);

  if (!scale) {
    return undefined;
  }

  const offsetForBand = realScaleType === 'scaleBand' && scale.bandwidth ? scale.bandwidth() / 2 : 2;
  let offset = type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;

  offset =
    axisType === 'angleAxis' && range != null && range?.length >= 2
      ? mathSign(range[0] - range[1]) * 2 * offset
      : offset;

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  if (isCategorical && categoricalDomain) {
    return categoricalDomain
      .map((entry: unknown, index: number): TickItem | null => {
        const scaled = scale.map(entry);
        if (!isWellBehavedNumber(scaled)) {
          return null;
        }
        return {
          coordinate: scaled + offset,
          value: entry,
          index,
          offset,
        };
      })
      .filter(isNotNil);
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale
    .domain()
    .map((entry: CategoricalDomainItem, index: number): TickItem | null => {
      const scaled = scale.map(entry);
      if (!isWellBehavedNumber(scaled)) {
        return null;
      }
      return {
        coordinate: scaled + offset,
        // @ts-expect-error can't use Date as an index
        value: duplicateDomain ? duplicateDomain[entry] : entry,
        index,
        offset,
      };
    })
    .filter(isNotNil);
};

/**
 * Of on four almost identical implementations of tick generation.
 * The four horsemen of tick generation are:
 * - {@link selectTooltipAxisTicks}
 * - {@link combineAxisTicks}
 * - {@link getTicksOfAxis}.
 * - {@link combineGraphicalItemTicks}
 */
export const selectTooltipAxisTicks: (state: RechartsRootState) => ReadonlyArray<TickItem> | undefined = createSelector(
  [
    selectChartLayout,
    selectTooltipAxis,
    selectTooltipAxisRealScaleType,
    selectTooltipAxisScale,
    selectTooltipAxisRange,
    selectTooltipDuplicateDomain,
    selectTooltipCategoricalDomain,
    selectTooltipAxisType,
  ],
  combineTicksOfTooltipAxis,
);

const selectTooltipEventType: (state: RechartsRootState) => TooltipEventType | undefined = createSelector(
  [selectDefaultTooltipEventType, selectValidateTooltipEventTypes, selectTooltipSettings],
  (defaultTooltipEventType, validateTooltipEventType, settings: TooltipSettingsState) =>
    combineTooltipEventType(settings.shared, defaultTooltipEventType, validateTooltipEventType),
);

const selectTooltipTrigger = (state: RechartsRootState) => state.tooltip.settings.trigger;

const selectDefaultIndex: (state: RechartsRootState) => TooltipIndex | undefined = state =>
  state.tooltip.settings.defaultIndex;

const selectTooltipInteractionState: (state: RechartsRootState) => TooltipInteractionState | undefined = createSelector(
  [selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex],
  combineTooltipInteractionState,
);

export const selectActiveTooltipIndex: (state: RechartsRootState) => TooltipIndex | null = createSelector(
  [selectTooltipInteractionState, selectTooltipDisplayedData, selectTooltipAxisDataKey, selectTooltipAxisDomain],
  combineActiveTooltipIndex,
);

export const selectActiveLabel: (state: RechartsRootState) => ActiveLabel = createSelector(
  [selectTooltipAxisTicks, selectActiveTooltipIndex],
  combineActiveLabel,
);

export const selectActiveTooltipDataKey: (state: RechartsRootState) => DataKey<any> | undefined = createSelector(
  [selectTooltipInteractionState],
  (tooltipInteraction: TooltipInteractionState | undefined): DataKey<any> | undefined => {
    if (!tooltipInteraction) {
      return undefined;
    }

    return tooltipInteraction.dataKey;
  },
);

export const selectActiveTooltipGraphicalItemId: (state: RechartsRootState) => string | undefined = createSelector(
  [selectTooltipInteractionState],
  (tooltipInteraction: TooltipInteractionState | undefined): string | undefined => {
    if (!tooltipInteraction) {
      return undefined;
    }

    return tooltipInteraction.graphicalItemId;
  },
);

const selectTooltipPayloadConfigurations = createSelector(
  [selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex],
  combineTooltipPayloadConfigurations,
);

const selectTooltipCoordinateForDefaultIndex: (state: RechartsRootState) => Coordinate | undefined = createSelector(
  [
    selectChartWidth,
    selectChartHeight,
    selectChartLayout,
    selectChartOffsetInternal,
    selectTooltipAxisTicks,
    selectDefaultIndex,
    selectTooltipPayloadConfigurations,
  ],
  combineCoordinateForDefaultIndex,
);

export const selectActiveTooltipCoordinate: (state: RechartsRootState) => Coordinate | undefined = createSelector(
  [selectTooltipInteractionState, selectTooltipCoordinateForDefaultIndex],
  (
    tooltipInteractionState: TooltipInteractionState | undefined,
    defaultIndexCoordinate: Coordinate | undefined,
  ): Coordinate | undefined => {
    if (tooltipInteractionState?.coordinate) {
      return tooltipInteractionState.coordinate;
    }

    return defaultIndexCoordinate;
  },
);

export const selectIsTooltipActive: (state: RechartsRootState) => boolean = createSelector(
  [selectTooltipInteractionState],
  (tooltipInteractionState: TooltipInteractionState | undefined): boolean => tooltipInteractionState?.active ?? false,
);

export const selectActiveTooltipPayload: (state: RechartsRootState) => TooltipPayload | undefined = createSelector(
  [
    selectTooltipPayloadConfigurations,
    selectActiveTooltipIndex,
    selectChartDataWithIndexes,
    selectTooltipAxisDataKey,
    selectActiveLabel,
    selectTooltipPayloadSearcher,
    selectTooltipEventType,
  ],
  combineTooltipPayload,
);

export const selectActiveTooltipDataPoints = createSelector([selectActiveTooltipPayload], payload => {
  if (payload == null) {
    return undefined;
  }
  const dataPoints = payload.map(p => p.payload).filter(p => p != null);
  return Array.from(new Set(dataPoints));
});
