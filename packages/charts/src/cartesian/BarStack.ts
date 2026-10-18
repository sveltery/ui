import { ReactNode } from '../react.js';
import { NormalizedStackId, StackId } from '../util/ChartUtils.js';
import { RectRadius } from '../shape/Rectangle.js';
export type BarStackProps = {
  /**
   * When two Bars have the same axisId and same stackId, then the two Bars are stacked in the chart.
   * This prop sets the stack ID for all Bar components inside this BarStack component.
   * If undefined, a unique id will be generated automatically.
   *
   * When both BarStack and individual Bar components have stackId defined,
   * the BarStack's stackId wins, and the individual Bar's stackId is ignored.
   */
  stackId?: StackId;
  /**
   * Radius applies only once to all bars inside of this stack group,
   * as if they were one huge bar.
   * Meaning that if you have three bars stacked together, and you set
   * radius to 10, only the outer corners of the entire stack will be rounded: the middle bars will have square corners.
   *
   * Unless! The edge bars are smaller than the radius value, in which case the bars at the edge get a lot of radius
   * and the middle one gets a little bit of radius.
   *
   * You may want to combine this with setting individual Bar components' radius to their own values for best effect.
   * `Bar.radius` prop will round corners of individual bars, while `BarStack.radius` will round corners of the entire stack.
   *
   * If you provide a single number, it applies to all four corners.
   * If you provide an array of four numbers, they apply to top-left, top-right, bottom-right, bottom-left corners respectively.
   *
   * @defaultValue 0
   */
  radius?: RectRadius;
  children?: ReactNode;
};
export type BarStackSettings = {
  stackId: NormalizedStackId;
  radius: RectRadius;
};
export const defaultBarStackProps = {
  radius: 0,
} as const satisfies Partial<BarStackProps>;
export const getClipPathId = (stackId: NormalizedStackId, index: number): string => {
  return `recharts-bar-stack-clip-path-${stackId}-${index}`;
};
