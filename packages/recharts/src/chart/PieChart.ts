import { defaultPolarChartProps } from './PolarChart.js';
import { PolarChartProps } from '../util/types.js';
export const defaultPieChartProps = {
  ...defaultPolarChartProps,
  layout: 'centric',
  startAngle: 0,
  endAngle: 360,
} as const satisfies Partial<PolarChartProps<never>>;
