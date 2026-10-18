import { PolarChartProps } from '../util/types.js';
import { defaultPolarChartProps } from './PolarChart.js';
export const defaultRadialBarChartProps = {
  ...defaultPolarChartProps,
  layout: 'radial',
  startAngle: 0,
  endAngle: 360,
} as const satisfies Partial<PolarChartProps<never>>;
