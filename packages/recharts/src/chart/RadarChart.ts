import { PolarChartProps, PolarLayout } from '../util/types.js';
import { defaultPolarChartProps } from './PolarChart.js';
export const defaultRadarChartProps = {
  ...defaultPolarChartProps,
  layout: 'centric',
  startAngle: 90,
  endAngle: -270,
} as const satisfies Partial<PolarChartProps<never>>;
export type RadarChartProps<DataPointType> = Omit<PolarChartProps<DataPointType>, 'layout' | 'startAngle' | 'endAngle'> & {
  /**
   * The layout of chart defines the orientation of axes, graphical items, and tooltip.
   *
   * @defaultValue centric
   */
  layout?: PolarLayout;
  /**
   * Angle in degrees from which the chart should start.
   * @defaultValue 90
   *
   */
  startAngle?: number;
  /**
   * Angle, in degrees, at which the chart should end.
   *
   * @defaultValue -270
   */
  endAngle?: number;
};
