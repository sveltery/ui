/**
 * This is an abstraction for rendering a user defined prop for a customized shape in several forms.
 *
 * <Shape /> is the root and will handle taking in:
 *  - an object of svg properties
 *  - a boolean
 *  - a render prop(inline function that returns jsx)
 *  - a React element
 *
 * <ShapeSelector /> is a subcomponent of <Shape /> and used to match a component
 * to the value of props.shapeType that is passed to the root.
 *
 */
export type ShapeType = 'trapezoid' | 'rectangle' | 'sector' | 'symbols' | 'curve';
export type ShapeProps<OptionType, ExtraProps> = {
  shapeType: ShapeType;
  option: OptionType;
  isActive?: boolean;
  index?: string | number;
  activeClassName?: string;
  inActiveClassName?: string;
} & ExtraProps;
export function defaultPropTransformer<OptionType, ExtraProps, ShapePropsType>(
  option: OptionType,
  props: ExtraProps,
): ShapePropsType {
  return {
    ...props,
    ...option,
  } as unknown as ShapePropsType;
}
