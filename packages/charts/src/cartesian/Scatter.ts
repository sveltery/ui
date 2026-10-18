import { ReactElement, ReactNode } from '../react.js';
import { ImplicitLabelListType } from '../component/LabelList.js';
import { CurveType, Props as CurveProps } from '../shape/Curve.js';
import { ActiveShape, AnimationDuration, AnimationTiming, Coordinate, DataConsumer, DataKey, DataProvider, LegendType, PresentationAttributesAdaptChildEvent, SymbolType } from '../util/types.js';
import { TooltipType } from '../component/DefaultTooltipContent.js';
import { ScatterShapeProps } from '../util/ScatterUtils.js';
import { InnerSymbolsProp } from '../shape/Symbols.js';
import { TooltipPayload } from '../state/tooltipSlice.js';
import { AxisId } from '../state/cartesianAxisSlice.js';
import { GraphicalItemId } from '../state/graphicalItemsSlice.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
import { ChartData } from '../state/chartDataSlice.js';
export interface ScatterPointNode {
  x?: number | string;
  y?: number | string;
  z?: number | string;
}
/**
 * Scatter coordinates are nullable because sometimes the point value is out of the domain,
 * and we can't compute a valid coordinate for it.
 *
 * Scatter -> Symbol ignores points with null cx or cy so those won't render if using the default shapes.
 * However: the points are exposed via various props and can be used in custom shapes so we keep them around.
 */
export interface ScatterPointItem {
  /**
   * The x coordinate of the point center in pixels.
   */
  cx: number | undefined;
  /**
   * The y coordinate of the point center in pixels.
   */
  cy: number | undefined;
  /**
   * The x coordinate (in pixels) of the top-left corner of the rectangle that wraps the point.
   */
  x: number | undefined;
  /**
   * The y coordinate (in pixels) of the top-left corner of the rectangle that wraps the point.
   */
  y: number | undefined;
  /**
   * ScatterPointItem size is an abstract number that is used to calculate the radius of the point.
   * It's not the radius itself, but rather a value that is used to calculate the radius.
   * Interacts with the zAxis range.
   */
  size: number;
  /**
   * Width of the point in pixels.
   */
  width: number;
  /**
   * Height of the point in pixels.
   */
  height: number;
  node: ScatterPointNode;
  payload?: any;
  tooltipPayload?: TooltipPayload;
  tooltipPosition: Coordinate;
}
export type ScatterCustomizedShape = ActiveShape<ScatterShapeProps, SVGPathElement & InnerSymbolsProp> | SymbolType;
/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */
interface ScatterInternalProps extends ZIndexable {
  data?: ChartData;
  xAxisId: string | number;
  yAxisId: string | number;
  zAxisId: string | number;

  dataKey?: DataKey<any>;

  line?: ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>) | CurveProps | boolean;
  lineType: 'fitting' | 'joint';
  lineJointType: CurveType;
  legendType: LegendType;
  tooltipType?: TooltipType;
  className?: string;
  name?: string;

  activeShape?: ScatterCustomizedShape;
  shape: ScatterCustomizedShape;
  points: ReadonlyArray<ScatterPointItem>;
  hide: boolean;
  label?: ImplicitLabelListType;

  isAnimationActive: boolean | 'auto';
  animationBegin: number;
  animationDuration: AnimationDuration;
  animationEasing: AnimationTiming;

  needClip: boolean;

  id: GraphicalItemId;
  children?: ReactNode;
}
/**
 * External props, intended for end users to fill in
 */
interface ScatterProps<DataPointType = any, DataValueType = any>
  extends DataProvider<DataPointType>, DataConsumer<DataPointType, DataValueType>, ZIndexable {
  /**
   * Unique identifier of this component.
   * Used as an HTML attribute `id`, and also to identify this element internally.
   *
   * If undefined, Recharts will generate a unique ID automatically.
   */
  id?: string;
  /**
   * The id of XAxis which is corresponding to the data. Required when there are multiple XAxes.
   * @defaultValue 0
   */
  xAxisId?: AxisId;
  /**
   * The id of YAxis which is corresponding to the data. Required when there are multiple YAxes.
   * @defaultValue 0
   */
  yAxisId?: AxisId;
  /**
   * The id of ZAxis which is corresponding to the data. Required when there are multiple ZAxes.
   *
   * ZAxis does not render directly, has no ticks and no tick line.
   * It is used to control the size of each scatter point.
   *
   * @defaultValue 0
   * @see {@link https://recharts.github.io/en-US/examples/ThreeDimScatterChart/ Scatter chart with Z axis}
   */
  zAxisId?: AxisId;

  /**
   * Renders line connecting individual points.
   * Options:
   * - `false`: no line is drawn.
   * - `true`: a default line is drawn.
   * - `ReactElement`: the option is the custom line element.
   * - `function`: the function will be called to render customized line.
   * - `object`: the option is the props of Curve element.
   *
   * Also see the `lineType` prop which controls how is this line calculated.
   *
   * @defaultValue false
   * @example <Scatter line />
   * @example <Scatter line={CustomizedLineComponent} />
   * @example <Scatter line={{ strokeDasharray: '5 5' }} />
   *
   * @see {@link https://recharts.github.io/en-US/examples/JointLineScatterChart/ Scatter chart with joint line}
   */
  line?: ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>) | CurveProps | boolean;
  /**
   * Determines calculation method of the line if the `line` prop is set.
   * Options:
   * - `'joint'`: line will be generated by connecting all the points.
   * - `'fitting'`: line will be generated by fitting algorithm (linear regression).
   *
   * Has no effect if `line` prop is not set or is false.
   *
   * @defaultValue joint
   * @example <Scatter line lineType="fitting" />
   * @see {@link http://recharts.github.io/en-US/examples/JointLineScatterChart/ Scatter chart with joint line}
   */
  lineType?: 'fitting' | 'joint';
  /**
   * Determines the shape of joint line.
   * Same as `type` prop on Curve, Line and Area components.
   *
   * Has no effect if `line` prop is not set or is false or if `lineType` is 'fitting'.
   *
   * @defaultValue linear
   * @see {@link http://recharts.github.io/en-US/examples/JointLineScatterChart/ Scatter chart with joint line}
   */
  lineJointType?: CurveType;
  /**
   * The type of icon in legend.
   * If set to 'none', no legend item will be rendered.
   *
   * @defaultValue 'circle'
   * @example <Scatter legendType="diamond" />
   */
  legendType?: LegendType;
  tooltipType?: TooltipType;
  className?: string;
  /**
   * The name of data.
   * This option will be used in tooltip and legend to represent this graphical item.
   * If no value was set to this option, the value of dataKey will be used alternatively.
   */
  name?: string;

  /**
   * This component is rendered when this graphical item is activated
   * (could be by mouse hover, touch, keyboard, programmatically).
   *
   * @see {@link http://recharts.github.io/en-US/examples/SimpleScatterChart/ Scatter chart with custom active shape}
   * @example <Scatter activeShape={{ fill: 'red' }} />
   */
  activeShape?: ScatterCustomizedShape;
  /**
   * Determines the shape of individual data points.
   * - Can be one of the predefined shapes as a string, which will be passed to {@link Symbols} component.
   * - If set a ReactElement, the shape of point can be customized.
   * - If set a function, the function will be called to render customized shape.
   * @defaultValue circle
   *
   * @example <Scatter shape={CustomizedShapeComponent} />
   * @example <Scatter shape="diamond" />
   *
   * @see {@link https://recharts.github.io/en-US/examples/JointLineScatterChart/ Scatter chart with custom shapes}
   */
  shape?: ScatterCustomizedShape;
  /**
   * Hides the whole graphical element when true.
   *
   * Hiding an element is different from removing it from the chart:
   * Hidden graphical elements are still visible in Legend,
   * and can be included in axis domain calculations,
   * depending on `includeHidden` props of your XAxis/YAxis.
   *
   * @defaultValue false
   */
  hide?: boolean;
  /**
   * Renders one label for each data point. Options:
   * - `true`: renders default labels;
   * - `false`: no labels are rendered;
   * - `object`: the props of LabelList component;
   * - `ReactElement`: a custom label element;
   * - `function`: a render function of custom label.
   *
   * @defaultValue false
   */
  label?: ImplicitLabelListType;

  /**
   * If set false, animation of Scatter points will be disabled.
   * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
   * @defaultValue 'auto'
   */
  isAnimationActive?: boolean | 'auto';
  /**
   * Specifies when the animation should begin, the unit of this option is ms.
   * @defaultValue 0
   */
  animationBegin?: number;
  /**
   * Specifies the duration of animation, the unit of this option is ms.
   * @defaultValue 400
   */
  animationDuration?: AnimationDuration;
  /**
   * The type of easing function.
   * @defaultValue 'linear'
   */
  animationEasing?: AnimationTiming;
  /**
   * Z-Index of this component and its children. The higher the value,
   * the more on top it will be rendered.
   * Components with higher zIndex will appear in front of components with lower zIndex.
   * If undefined or 0, the content is rendered in the default layer without portals.
   *
   * @since 3.4
   * @defaultValue 600
   * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
   */
  zIndex?: number;
  children?: ReactNode;
}
/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */
type BaseScatterSvgProps = Omit<
  PresentationAttributesAdaptChildEvent<ScatterPointItem, SVGGraphicsElement>,
  'points' | 'ref' | 'children' | 'dangerouslySetInnerHTML'
>;
type InternalProps = BaseScatterSvgProps & ScatterInternalProps;
export type Props<DataPointType = any, ValueAxisType = any> = BaseScatterSvgProps &
  ScatterProps<DataPointType, ValueAxisType>;
type InputRequiredToComputeTooltipEntrySettings = {
  dataKey?: DataKey<any> | undefined;
  points?: ReadonlyArray<ScatterPointItem>;
  stroke?: string;
  strokeWidth?: number | string;
  fill?: string;
  name?: string;
  hide?: boolean;
  tooltipType?: TooltipType;
  id: GraphicalItemId;
};
type ScatterSymbolsProps = {
  points: ReadonlyArray<ScatterPointItem>;
  showLabels: boolean;
  allOtherScatterProps: InternalProps;
};
