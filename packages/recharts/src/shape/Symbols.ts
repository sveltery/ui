import { SVGProps } from '../react.js';
import { SymbolType as D3SymbolType } from 'victory-vendor/d3-shape';
import { SymbolType } from '../util/types.js';
type SizeType = 'area' | 'diameter';
interface SymbolFactory {
  [type: string]: D3SymbolType;
}
export interface InnerSymbolsProp {
  className?: string;
  type?: SymbolType;
  cx?: number;
  cy?: number;
  size?: number;
  sizeType?: SizeType;
}
export type SymbolsProps = Omit<SVGProps<SVGPathElement>, 'type'> & InnerSymbolsProp;
