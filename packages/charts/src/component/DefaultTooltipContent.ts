import * as React from '../react.js';
import { CSSProperties, ReactNode, SVGProps } from '../react.js';
import sortBy from 'es-toolkit/compat/sortBy';
import { isNumOrStr } from '../util/DataUtils.js';
import { DataKey } from '../util/types.js';
export function defaultFormatter(value: ValueType | undefined): React.ReactNode {
  return Array.isArray(value) && isNumOrStr(value[0]) && isNumOrStr(value[1]) ? value.join(' ~ ') : value;
}
export type TooltipType = 'none';
export type ValueType = number | string | ReadonlyArray<number | string>;
export type NameType = number | string;
export type Formatter<TValue extends ValueType = ValueType, TName extends NameType = NameType> = (
  value: TValue | undefined,
  name: TName | undefined,
  item: Payload<TValue, TName>,
  index: number,
  payload: ReadonlyArray<Payload<TValue, TName>>,
) => [React.ReactNode, TName] | React.ReactNode;
export interface Payload<TValue extends ValueType = ValueType, TName extends NameType = NameType> extends Omit<
  SVGProps<SVGElement>,
  'name'
> {
  type?: TooltipType;
  color?: string;
  formatter?: Formatter<TValue, TName>;
  name?: TName;
  value?: TValue;
  unit?: ReactNode;
  fill?: string;
  dataKey?: DataKey<any>;
  nameKey?: DataKey<any>;
  payload?: any;
  chartType?: string;
  stroke?: string;
  strokeDasharray?: string | number;
  strokeWidth?: number | string;
  className?: string;
  hide?: boolean;
  /**
   * The id of the graphical item that the data point belongs to
   */
  graphicalItemId: string;
}
/**
 * @inline
 */
export type TooltipItemSorter<TValue extends ValueType = ValueType, TName extends NameType = NameType> =
  | 'dataKey'
  | 'value'
  | 'name'
  | ((item: Payload<TValue, TName>) => number | string | undefined);
export interface Props<TValue extends ValueType = ValueType, TName extends NameType = NameType> {
  separator?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  formatter?: Formatter<TValue, TName>;
  contentStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  labelFormatter?: (label: ReactNode, payload: ReadonlyArray<Payload<TValue, TName>>) => ReactNode;
  label?: ReactNode;
  payload?: ReadonlyArray<Payload<TValue, TName>>;
  itemSorter?: TooltipItemSorter<TValue, TName>;
  accessibilityLayer?: boolean;
}
export const defaultDefaultTooltipContentProps = {
  separator: ' : ',
  contentStyle: {
    margin: 0,
    padding: 10,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    whiteSpace: 'nowrap',
  },
  itemStyle: {
    display: 'block',
    paddingTop: 4,
    paddingBottom: 4,
    color: '#000',
  },
  labelStyle: {},
  accessibilityLayer: false,
} as const satisfies Partial<Props<any, any>>;
export function lodashLikeSortBy<T>(array: ReadonlyArray<T>, itemSorter: TooltipItemSorter | undefined): ReadonlyArray<T> {
  if (itemSorter == null) {
    return array;
  }
  // @ts-expect-error sortBy types somehow are returning a number type.
  return sortBy(array, itemSorter);
}
