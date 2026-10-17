import { BaseValue } from '../../cartesian/Area.js';
import { DataKey } from '../../util/types.js';
import { ChartData } from '../chartDataSlice.js';
import { MaybeStackedGraphicalItem } from './StackedGraphicalItem.js';
import { BaseCartesianGraphicalItemSettings } from '../graphicalItemsSlice.js';

export type AreaSettings = BaseCartesianGraphicalItemSettings &
  MaybeStackedGraphicalItem & {
    type: 'area';
    connectNulls: boolean;
    baseValue: BaseValue | undefined;
    dataKey: DataKey<any>;
    data: ChartData | undefined;
  };
