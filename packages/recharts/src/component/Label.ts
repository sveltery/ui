import * as React from '../react.js';
import { ReactElement, SVGProps } from '../react.js';
import { RenderableText, TextAnchor, TextVerticalAnchor } from './Text.js';
import { DataKey, ViewBox } from '../util/types.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
import { CartesianLabelPosition } from '../cartesian/getCartesianPosition.js';
/**
 * @inline
 */
export type LabelContentType = ReactElement | ((props: Props) => RenderableText | ReactElement);
type PolarLabelPosition = 'insideStart' | 'insideEnd' | 'end';
/**
 * @inline
 */
export type LabelPosition = CartesianLabelPosition | PolarLabelPosition;
/**
 * @inline
 */
export type LabelFormatter = (label: RenderableText) => RenderableText;
interface LabelProps extends ZIndexable {
  /**
   * The box of viewing area. Used for positioning.
   * If undefined, viewBox will be calculated based on surrounding context.
   */
  viewBox?: ViewBox;
  parentViewBox?: ViewBox;
  /**
   * Function to customize how content is serialized before rendering.
   *
   * This should return a renderable text - something that the {@link Text} component can render.
   * Typically, a string or number.
   * Custom components are not supported here - use the `content` prop instead.
   */
  formatter?: LabelFormatter;
  /**
   * The value of label can be set as children or as the `value` prop
   *
   * @example <Label value="foo" />
   */
  value?: RenderableText;
  /**
   * The offset to the specified "position". Direction of the offset depends on the position.
   *
   * @defaultValue 5
   */
  offset?: number;
  /**
   * The position of label relative to the view box.
   *
   * @defaultValue middle
   */
  position?: LabelPosition;
  /**
   * The value of label can be set as children or as the `value` prop
   *
   * @example <Label>foo</Label>
   */
  children?: RenderableText;
  className?: string;
  /**
   * If set a React element, the option is the custom react element of rendering label.
   * If set a function, the function will be called to render label content.
   *
   * @example <Label content={CustomizedLabel} />
   * @example
   * const renderCustomLabel = (props) => <text {...props}>Custom Label</text>;
   * <Label content={renderCustomLabel} />
   */
  content?: LabelContentType;
  /**
   * @defaultValue false
   */
  textBreakAll?: boolean;
  /**
   * Text rotation angle in degrees.
   * Positive values rotate clockwise, negative values rotate counterclockwise.
   *
   * @defaultValue 0
   */
  angle?: number;
  index?: number;
  labelRef?: React.RefObject<SVGTextElement> | null;
  /**
   * Z-Index of this component and its children. The higher the value,
   * the more on top it will be rendered.
   * Components with higher zIndex will appear in front of components with lower zIndex.
   * If undefined or 0, the content is rendered in the default layer without portals.
   *
   * @since 3.4
   * @defaultValue 2000
   * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
   */
  zIndex?: number;
  /**
   * Unique identifier of this component.
   * Used as an HTML attribute `id`.
   */
  id?: string;
}
export type Props = Omit<SVGProps<SVGTextElement>, 'viewBox'> & LabelProps;
type PropsWithDefaults = Props & {
  offset: number;
};
export type ImplicitLabelType =
  | boolean
  | string
  | number
  | ReactElement<SVGElement>
  | ((props: any) => RenderableText | ReactElement)
  // dataKey is only applicable when label is used implicitly from graphical element props
  | (Props & { dataKey?: DataKey<any> });
export type LabelPositionAttributes = {
  x: number;
  y: number;
  textAnchor: TextAnchor;
  verticalAnchor: TextVerticalAnchor;
  width?: number;
  height?: number;
};
