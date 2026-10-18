import { Props } from './PolarRadiusAxis.js';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';

export const defaultPolarRadiusAxisProps = {
  allowDataOverflow: false,
  allowDecimals: false,
  allowDuplicatedCategory: true,
  angle: 0,
  axisLine: true,
  includeHidden: false,
  hide: false,
  niceTicks: 'auto',
  label: false,
  orientation: 'right',
  radiusAxisId: 0,
  reversed: false,
  scale: 'auto',
  stroke: '#ccc',
  tick: true,
  tickCount: 5,
  tickLine: true,
  type: 'auto',
  zIndex: DefaultZIndexes.axis,
} as const satisfies Props;
