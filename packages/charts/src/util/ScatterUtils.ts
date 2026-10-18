import { ScatterPointItem } from '../cartesian/Scatter.js';
import { DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME } from './Constants.js';
import { GraphicalItemId } from '../state/graphicalItemsSlice.js';
export type ScatterShapeProps = ScatterPointItem & {
  index: number;
  [DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME]: GraphicalItemId;
};
