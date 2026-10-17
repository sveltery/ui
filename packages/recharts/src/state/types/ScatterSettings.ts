import { ChartData } from '../chartDataSlice.js';
import { DataKey } from '../../util/types.js';
import { TooltipType } from '../../component/DefaultTooltipContent.js';
import { BaseCartesianGraphicalItemSettings } from '../graphicalItemsSlice.js';

export type ScatterSettings = BaseCartesianGraphicalItemSettings & {
  type: 'scatter';
  data: ChartData | undefined;
  dataKey: DataKey<any> | undefined;
  tooltipType: TooltipType | undefined;
  name: string | number | undefined;
};
