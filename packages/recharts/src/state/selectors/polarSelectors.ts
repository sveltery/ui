import { createSelector } from 'reselect';
import { AppliedChartData, ChartData } from '../chartDataSlice.js';
import { RechartsRootState } from '../store.js';
import { AxisId, BaseCartesianAxis } from '../cartesianAxisSlice.js';
import { selectChartDataAndAlwaysIgnoreIndexes } from './dataSelectors.js';
import {
  AppliedChartDataWithErrorDomain,
  combineAppliedValues,
  combineAxisDomain,
  combineAxisDomainWithNiceTicks,
  combineDisplayedData,
  combineDomainOfAllAppliedNumericalValuesIncludingErrorValues,
  combineGraphicalItemsData,
  combineGraphicalItemsSettings,
  combineNiceTicks,
  combineNumericalDomain,
  itemAxisPredicate,
  selectAllErrorBarSettings,
  selectBaseAxis,
  selectDomainDefinition,
  selectDomainFromUserPreference,
  selectRealScaleType,
  selectRenderableAxisSettings,
} from './axisSelectors.js';
import { PolarGraphicalItemSettings } from '../graphicalItemsSlice.js';
import { CategoricalDomain, NumberDomain } from '../../util/types.js';
import { selectChartLayout } from '../../context/chartLayoutContext.js';
import { getValueByDataKey } from '../../util/ChartUtils.js';
import { pickAxisType } from './pickAxisType.js';
import { pickAxisId } from './pickAxisId.js';
import { selectStackOffsetType } from './rootPropsSelectors.js';
import { combineCheckedDomain } from './combiners/combineCheckedDomain.js';

export type PolarAxisType = 'angleAxis' | 'radiusAxis';

export const selectUnfilteredPolarItems = (state: RechartsRootState) => state.graphicalItems.polarItems;

const selectAxisPredicate: (
  _state: RechartsRootState,
  axisType: PolarAxisType,
  axisId: AxisId,
) => (item: PolarGraphicalItemSettings) => boolean = createSelector([pickAxisType, pickAxisId], itemAxisPredicate);

export const selectPolarItemsSettings: (
  state: RechartsRootState,
  axisType: PolarAxisType,
  polarAxisId: AxisId,
) => ReadonlyArray<PolarGraphicalItemSettings> = createSelector(
  [selectUnfilteredPolarItems, selectBaseAxis, selectAxisPredicate],
  combineGraphicalItemsSettings,
);

const selectPolarGraphicalItemsData: (
  state: RechartsRootState,
  axisType: PolarAxisType,
  polarAxisId: AxisId,
) => ChartData = createSelector([selectPolarItemsSettings], combineGraphicalItemsData);

export const selectPolarDisplayedData: (
  state: RechartsRootState,
  axisType: PolarAxisType,
  polarAxisId: AxisId,
) => ChartData = createSelector(
  [selectPolarGraphicalItemsData, selectChartDataAndAlwaysIgnoreIndexes],
  combineDisplayedData,
);

export const selectPolarAppliedValues: (
  state: RechartsRootState,
  axisType: PolarAxisType,
  axisId: AxisId,
) => AppliedChartData = createSelector(
  [selectPolarDisplayedData, selectBaseAxis, selectPolarItemsSettings],
  combineAppliedValues,
);

export const selectAllPolarAppliedNumericalValues: (
  state: RechartsRootState,
  axisType: PolarAxisType,
  axisId: AxisId,
) => ReadonlyArray<AppliedChartDataWithErrorDomain> = createSelector(
  [selectPolarDisplayedData, selectBaseAxis, selectPolarItemsSettings],
  (
    data: ChartData,
    axisSettings: BaseCartesianAxis,
    items: ReadonlyArray<PolarGraphicalItemSettings>,
  ): ReadonlyArray<AppliedChartDataWithErrorDomain> => {
    if (items.length > 0) {
      return data
        .flatMap(entry => {
          return items.flatMap((item): AppliedChartDataWithErrorDomain | undefined => {
            const valueByDataKey: unknown = getValueByDataKey(entry, axisSettings.dataKey ?? item.dataKey);
            return {
              value: valueByDataKey,
              errorDomain: [], // polar charts do not have error bars
            };
          });
        })
        .filter(Boolean);
    }
    if (axisSettings?.dataKey != null) {
      return data.map(
        (item): AppliedChartDataWithErrorDomain => ({
          value: getValueByDataKey(item, axisSettings.dataKey),
          errorDomain: [],
        }),
      );
    }
    return data.map((entry): AppliedChartDataWithErrorDomain => ({ value: entry, errorDomain: [] }));
  },
);

const unsupportedInPolarChart = (): undefined => undefined;

const selectDomainOfAllPolarAppliedNumericalValues: (
  state: RechartsRootState,
  axisType: PolarAxisType,
  axisId: AxisId,
) => NumberDomain | undefined = createSelector(
  [selectPolarDisplayedData, selectBaseAxis, selectPolarItemsSettings, selectAllErrorBarSettings, pickAxisType],
  combineDomainOfAllAppliedNumericalValuesIncludingErrorValues,
);

const selectPolarNumericalDomain: (
  state: RechartsRootState,
  axisType: PolarAxisType,
  axisId: AxisId,
) => NumberDomain | undefined = createSelector(
  [
    selectBaseAxis,
    selectDomainDefinition,
    selectDomainFromUserPreference,
    unsupportedInPolarChart,
    selectDomainOfAllPolarAppliedNumericalValues,
    unsupportedInPolarChart,
    selectChartLayout,
    pickAxisType,
  ],
  combineNumericalDomain,
);

export const selectPolarAxisDomain: (
  state: RechartsRootState,
  axisType: PolarAxisType,
  polarAxisId: AxisId,
) => NumberDomain | CategoricalDomain | undefined = createSelector(
  [
    selectBaseAxis,
    selectChartLayout,
    selectPolarDisplayedData,
    selectPolarAppliedValues,
    selectStackOffsetType,
    pickAxisType,
    selectPolarNumericalDomain,
  ],
  combineAxisDomain,
);

export const selectPolarNiceTicks = createSelector(
  [selectPolarAxisDomain, selectRenderableAxisSettings, selectRealScaleType],
  combineNiceTicks,
);

export const selectPolarAxisDomainIncludingNiceTicks: (
  state: RechartsRootState,
  axisType: PolarAxisType,
  polarAxisId: AxisId,
) => NumberDomain | CategoricalDomain | undefined = createSelector(
  [selectBaseAxis, selectPolarAxisDomain, selectPolarNiceTicks, pickAxisType],
  combineAxisDomainWithNiceTicks,
);

export const selectPolarAxisCheckedDomain: (
  state: RechartsRootState,
  axisType: PolarAxisType,
  polarAxisId: AxisId,
) => NumberDomain | CategoricalDomain | undefined = createSelector(
  [selectRealScaleType, selectPolarAxisDomainIncludingNiceTicks],
  combineCheckedDomain,
);
