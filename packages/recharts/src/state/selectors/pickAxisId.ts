import { RechartsRootState } from '../store.js';
import { AxisId } from '../cartesianAxisSlice.js';

export const pickAxisId = (_state: RechartsRootState, _axisType: unknown, axisId: AxisId): AxisId => axisId;
