import { ChartData } from '../chartDataSlice.js';
import { DataKey } from '../../util/types.js';
import { BaseCartesianGraphicalItemSettings } from '../graphicalItemsSlice.js';

export type LineSettings = BaseCartesianGraphicalItemSettings & {
  type: 'line';
  data: ChartData | undefined;
  dataKey: DataKey<any> | undefined;
};
