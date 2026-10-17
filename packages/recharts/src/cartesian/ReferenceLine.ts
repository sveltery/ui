import { ReactElement, SVGProps } from '../react.js';
import { ImplicitLabelType } from '../component/Label.js';
import { Overflowable } from '../util/IfOverflow.js';
import { RequiresDefaultProps } from '../util/resolveDefaultProps.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
import { BandPosition } from '../util/scale/RechartsScale.js';
/**
 * Single point that defines one end of a segment.
 * These coordinates are in data space, meaning that you should provide
 * values that correspond to the data domain of the axes.
 * So you would provide a value of `Page A` to indicate the data value `Page A`
 * and then recharts will convert that to pixels.
 *
 * Likewise for numbers. If your x-axis goes from 0 to 100,
 * and you want the line to end at 50, you would provide `50` here.
 *
 * @inline
 */
export type ReferenceLineSegment = readonly [
  {
    x?: number | string;
    y?: number | string;
  },
  {
    x?: number | string;
    y?: number | string;
  },
];
type ReferenceCoordinateValue = number | string;
interface ReferenceLineProps<
  XValueType extends ReferenceCoordinateValue = any,
  YValueType extends ReferenceCoordinateValue = any,
>
  extends Overflowable, ZIndexable {
  /**
   * If defined, renders a horizontal line on this position.
   *
   * This value is using your chart's domain, so you will provide a data value instead of a pixel value.
   * ReferenceLine will internally calculate the correct pixel position.
   *
   * @example <ReferenceLine y="Page D" />
   */
  y?: YValueType;

  /**
   * If defined, renders a vertical line on this position.
   *
   * This value is using your chart's domain, so you will provide a data value instead of a pixel value.
   * ReferenceLine will internally calculate the correct pixel position.
   *
   * @example <ReferenceLine x="Monday" />
   */
  x?: XValueType;

  /**
   * Tuple of coordinates. If defined, renders a diagonal line segment.
   */
  segment?: readonly [
    {
      x?: XValueType;
      y?: YValueType;
    },
    {
      x?: XValueType;
      y?: YValueType;
    },
  ];

  /**
   * The position of the reference line when the axis has bandwidth
   * (e.g., a band scale). This determines where within the band
   * the line is drawn.
   * @defaultValue 'middle'
   */
  position?: BandPosition;

  className?: number | string;
  /**
   * The id of y-axis which is corresponding to the data.
   * Required when there are multiple YAxes.
   * @defaultValue 0
   */
  yAxisId?: number | string;
  /**
   * The id of x-axis which is corresponding to the data.
   * Required when there are multiple XAxes.
   * @defaultValue 0
   */
  xAxisId?: number | string;
  shape?: ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>);
  /**
   * Renders a single label.
   *
   * - `false`: no labels are rendered
   * - `string` | `number`: the content of the label
   * - `object`: the props of LabelList component
   * - `ReactElement`: a custom label element
   * - `function`: a render function of custom label
   *
   * @defaultValue false
   *
   * @see {@link https://recharts.github.io/en-US/examples/LineChartWithReferenceLines/ Reference elements with a label}
   */
  label?: ImplicitLabelType;
  /**
   * Z-Index of this component and its children. The higher the value,
   * the more on top it will be rendered.
   * Components with higher zIndex will appear in front of components with lower zIndex.
   * If undefined or 0, the content is rendered in the default layer without portals.
   *
   * @since 3.4
   * @defaultValue 400
   * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
   */
  zIndex?: number;
  /**
   * The width of the stroke
   * @defaultValue 1
   */
  strokeWidth?: number | string;
}
/**
 * This excludes `viewBox` prop from svg for two reasons:
 * 1. The components wants viewBox of object type, and svg wants string
 *    - so there's a conflict, and the component will throw if it gets string
 * 2. Internally the component calls `svgPropertiesNoEvents` which filters the viewBox away anyway
 */
export type Props<
  XValueType extends ReferenceCoordinateValue = any,
  YValueType extends ReferenceCoordinateValue = any,
> = Omit<SVGProps<SVGLineElement>, 'viewBox'> & ReferenceLineProps<XValueType, YValueType>;
type EndPointsPropsSubset = Pick<PropsWithDefaults, 'y' | 'x' | 'segment' | 'ifOverflow'>;
export const referenceLineDefaultProps = {
  ifOverflow: 'discard',
  xAxisId: 0,
  yAxisId: 0,
  fill: 'none',
  label: false,
  stroke: '#ccc',
  fillOpacity: 1,
  strokeWidth: 1,
  position: 'middle',
  zIndex: DefaultZIndexes.line,
} as const satisfies Partial<Props>;
type PropsWithDefaults = RequiresDefaultProps<Props, typeof referenceLineDefaultProps>;
