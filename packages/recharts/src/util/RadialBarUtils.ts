import { RadialBarDataItem, RadialBarProps } from '../polar/RadialBar.js';
export interface RadialBarSectorProps extends RadialBarDataItem {
  index: number;
  option: RadialBarProps['activeShape'];
  isActive: boolean;
}
