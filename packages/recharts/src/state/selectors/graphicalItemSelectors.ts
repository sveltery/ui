import { RechartsRootState } from '../store.js';
import { GraphicalItemId } from '../graphicalItemsSlice.js';
import { AxisId, defaultAxisId } from '../cartesianAxisSlice.js';

export function selectXAxisIdFromGraphicalItemId(state: RechartsRootState, id: GraphicalItemId): AxisId {
  return state.graphicalItems.cartesianItems.find(item => item.id === id)?.xAxisId ?? defaultAxisId;
}

export function selectYAxisIdFromGraphicalItemId(state: RechartsRootState, id: GraphicalItemId): AxisId {
  return state.graphicalItems.cartesianItems.find(item => item.id === id)?.yAxisId ?? defaultAxisId;
}
