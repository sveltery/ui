import { CSSProperties } from '../react.js';
import { ContentType, LegendPayload, Props as DefaultLegendContentProps, VerticalAlignmentType } from './DefaultLegendContent.js';
import { LayoutType, Margin } from '../util/types.js';
import { UniqueOption } from '../util/payload/getUniqPayload.js';
import { ElementOffset } from '../util/useElementOffset.js';
export function defaultUniqBy(entry: LegendPayload) {
  return entry.value;
}
type ContentProps = Props & {
  margin: Margin | undefined;
  chartWidth: number;
  chartHeight: number;
  contextPayload: ReadonlyArray<LegendPayload>;
};
type PositionInput = {
  layout?: Props['layout'];
  align?: Props['align'];
  verticalAlign?: Props['verticalAlign'];
};
export function getDefaultPosition(
  style: CSSProperties | undefined,
  props: PositionInput,
  margin: Margin | undefined,
  chartWidth: number,
  chartHeight: number,
  box: ElementOffset,
) {
  const { layout, align, verticalAlign } = props;
  let hPos, vPos;

  if (
    !style ||
    ((style.left === undefined || style.left === null) && (style.right === undefined || style.right === null))
  ) {
    if (align === 'center' && layout === 'vertical') {
      hPos = { left: ((chartWidth || 0) - box.width) / 2 };
    } else {
      hPos = align === 'right' ? { right: (margin && margin.right) || 0 } : { left: (margin && margin.left) || 0 };
    }
  }

  if (
    !style ||
    ((style.top === undefined || style.top === null) && (style.bottom === undefined || style.bottom === null))
  ) {
    if (verticalAlign === 'middle') {
      vPos = { top: ((chartHeight || 0) - box.height) / 2 };
    } else {
      vPos =
        verticalAlign === 'bottom' ? { bottom: (margin && margin.bottom) || 0 } : { top: (margin && margin.top) || 0 };
    }
  }

  return { ...hPos, ...vPos };
}
export type LegendItemSorter = 'value' | 'dataKey' | ((item: LegendPayload) => number | string);
export type Props = Omit<DefaultLegendContentProps, 'payload' | 'ref' | 'verticalAlign'> & {
  /**
   * Renders the content of the legend.
   *
   * This should return HTML elements, not SVG elements.
   *
   * - If not set, the {@link DefaultLegendContent} component is used.
   * - If set to a React element, this element will be cloned and extra props will be passed in.
   * - If set to a function, the function will be called and should return HTML elements.
   *
   * @example <Legend content={CustomizedLegend} />
   * @example <Legend content={renderLegend} />
   */
  content?: ContentType;
  /**
   * CSS styles to be applied to the wrapper `div` element.
   */
  wrapperStyle?: CSSProperties;
  /**
   * Width of the legend.
   * Accept CSS style string values like `100%` or `fit-content`, or number values like `400`.
   */
  width?: number | string;
  /**
   * Height of the legend.
   * Accept CSS style string values like `100%` or `fit-content`, or number values like `400`.
   */
  height?: number | string;
  payloadUniqBy?: UniqueOption<LegendPayload>;
  onBBoxUpdate?: (box: ElementOffset | null) => void;
  /**
   * If portal is defined, then Legend will use this element as a target
   * for rendering using React Portal.
   *
   * If this is undefined then Legend renders inside the recharts-wrapper element.
   *
   * @see {@link https://react.dev/reference/react-dom/createPortal}
   */
  portal?: HTMLElement | null;
  /**
   * Sorts Legend items. Defaults to `value` which means it will sort alphabetically
   * by the label.
   *
   * If `null` is provided then the payload is not sorted. Be aware that without sort,
   * the order of items may change between renders!
   *
   * @defaultValue value
   */
  itemSorter?: LegendItemSorter | null;
  /**
   * The alignment of the whole Legend container:
   *
   * - `bottom`: shows the Legend below chart, and chart height reduces automatically to make space for it.
   * - `top`: shows the Legend above chart, and chart height reduces automatically.
   * - `middle`:  shows the Legend in the middle of chart, covering other content, and chart height remains unchanged.
   * The exact behavior changes depending on `align` prop.
   *
   * @defaultValue bottom
   */
  verticalAlign?: VerticalAlignmentType;
};
export function getWidthOrHeight(
  layout: LayoutType | undefined,
  height: number | string | undefined,
  width: number | string | undefined,
  maxWidth: number,
): null | { height?: number | string; width?: number | string } {
  if (layout === 'vertical' && height != null) {
    return {
      height,
    };
  }
  if (layout === 'horizontal') {
    return {
      width: width || maxWidth,
    };
  }

  return null;
}
export const legendDefaultProps = {
  align: 'center',
  iconSize: 14,
  inactiveColor: '#ccc',
  itemSorter: 'value',
  layout: 'horizontal',
  verticalAlign: 'bottom',
} as const satisfies Partial<Props>;
