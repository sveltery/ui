import { MinPointSize } from '../../util/BarUtils.js';
import { MaybeStackedGraphicalItem } from './StackedGraphicalItem.js';
import { BaseCartesianGraphicalItemSettings } from '../graphicalItemsSlice.js';

export type BarSettings = BaseCartesianGraphicalItemSettings &
  MaybeStackedGraphicalItem & {
    type: 'bar';
    maxBarSize: number | undefined;
    minPointSize: MinPointSize;
    /**
     * When true, zero-dimension bars are not filtered out because the custom shape may still render something visible.
     */
    hasCustomShape: boolean;
  };
