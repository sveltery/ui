import { SVGProps } from '../react.js';
import { symbolCircle, symbolCross, symbolDiamond, symbolSquare, symbolStar, symbolTriangle, symbolWye, SymbolType as D3SymbolType } from 'victory-vendor/d3-shape';
import { SymbolType } from '../util/types.js';
import { upperFirst } from '../util/DataUtils.js';
type SizeType = 'area' | 'diameter';
interface SymbolFactory {
  [type: string]: D3SymbolType;
}
const symbolFactories: SymbolFactory = {
  symbolCircle,
  symbolCross,
  symbolDiamond,
  symbolSquare,
  symbolStar,
  symbolTriangle,
  symbolWye,
};
const RADIAN = Math.PI / 180;
export const getSymbolFactory = (type: SymbolType) => {
  const name = `symbol${upperFirst(type)}`;

  return symbolFactories[name] || symbolCircle;
};
export const calculateAreaSize = (size: number, sizeType: SizeType, type: SymbolType) => {
  if (sizeType === 'area') {
    return size;
  }

  switch (type) {
    case 'cross':
      return (5 * size * size) / 9;
    case 'diamond':
      return (0.5 * size * size) / Math.sqrt(3);
    case 'square':
      return size * size;
    case 'star': {
      const angle = 18 * RADIAN;

      return 1.25 * size * size * (Math.tan(angle) - Math.tan(angle * 2) * Math.tan(angle) ** 2);
    }
    case 'triangle':
      return (Math.sqrt(3) * size * size) / 4;
    case 'wye':
      return ((21 - 10 * Math.sqrt(3)) * size * size) / 8;
    default:
      return (Math.PI * size * size) / 4;
  }
};
export interface InnerSymbolsProp {
  className?: string;
  type?: SymbolType;
  cx?: number;
  cy?: number;
  size?: number;
  sizeType?: SizeType;
}
export type SymbolsProps = Omit<SVGProps<SVGPathElement>, 'type'> & InnerSymbolsProp;
