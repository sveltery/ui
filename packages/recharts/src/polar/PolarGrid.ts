import { SVGProps } from '../react.js';
import { polarToCartesian } from '../util/PolarUtils.js';
import { AxisId } from '../state/cartesianAxisSlice.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
interface PolarGridProps extends ZIndexable {
  /**
   * The x-coordinate of center.
   * When used inside a chart context, this prop is calculated based on the chart's dimensions,
   * and this prop is ignored.
   *
   * This is only used when rendered outside a chart context.
   */
  cx?: number;
  /**
   * The y-coordinate of center.
   * When used inside a chart context, this prop is calculated based on the chart's dimensions,
   * and this prop is ignored.
   *
   * This is only used when rendered outside a chart context.
   */
  cy?: number;
  /**
   * The radius of the inner polar grid.
   * When used inside a chart context, this prop is calculated based on the chart's dimensions,
   * and this prop is ignored.
   *
   * This is only used when rendered outside a chart context.
   */
  innerRadius?: number;
  /**
   * The radius of the outer polar grid.
   * When used inside a chart context, this prop is calculated based on the chart's dimensions,
   * and this prop is ignored.
   *
   * This is only used when rendered outside a chart context.
   */
  outerRadius?: number;
  /**
   * The array of every line grid's angle.
   */
  polarAngles?: ReadonlyArray<number>;
  /**
   * The array of every circle grid's radius.
   */
  polarRadius?: ReadonlyArray<number>;
  /**
   * The type of polar grids.
   * @defaultValue polygon
   */
  gridType?: 'polygon' | 'circle';
  /**
   * @defaultValue true
   */
  radialLines?: boolean;
  /**
   * @defaultValue 0
   */
  angleAxisId?: AxisId;
  /**
   * @defaultValue 0
   */
  radiusAxisId?: AxisId;
  /**
   * Z-Index of this component and its children. The higher the value,
   * the more on top it will be rendered.
   * Components with higher zIndex will appear in front of components with lower zIndex.
   * If undefined or 0, the content is rendered in the default layer without portals.
   *
   * @since 3.4
   * @defaultValue -100
   * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
   */
  zIndex?: number;
}
export type Props = SVGProps<SVGLineElement> & PolarGridProps;
export type PropsWithDefaults = Props & {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  polarAngles: ReadonlyArray<number>;
  polarRadius: ReadonlyArray<number>;
};
export type ConcentricProps = PropsWithDefaults & {
  // The radius of circle
  radius: number;
};
export const getPolygonPath = (radius: number, cx: number, cy: number, polarAngles: ReadonlyArray<number>) => {
  let path = '';

  polarAngles.forEach((angle: number, i: number) => {
    const point = polarToCartesian(cx, cy, radius, angle);

    if (i) {
      path += `L ${point.x},${point.y}`;
    } else {
      path += `M ${point.x},${point.y}`;
    }
  });
  path += 'Z';

  return path;
};
export const defaultPolarGridProps = {
  angleAxisId: 0,
  radiusAxisId: 0,
  gridType: 'polygon',
  radialLines: true,
  zIndex: DefaultZIndexes.grid,
} as const satisfies Partial<Props>;
