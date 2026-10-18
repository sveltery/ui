import { MaybeStackedGraphicalItem } from './StackedGraphicalItem.js';
import { BasePolarGraphicalItemSettings } from '../graphicalItemsSlice.js';

export interface RadialBarSettings extends BasePolarGraphicalItemSettings, MaybeStackedGraphicalItem {
  type: 'radialBar';
  minPointSize: number;
  maxBarSize: number | undefined;
}
