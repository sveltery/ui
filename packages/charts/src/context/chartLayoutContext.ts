import { CartesianViewBoxRequired, LayoutType, PolarLayout, TrapezoidViewBox } from '../util/types.js';
import { RechartsRootState } from '../state/store.js';
export function cartesianViewBoxToTrapezoid(box: undefined): undefined;
export function cartesianViewBoxToTrapezoid(box: CartesianViewBoxRequired | TrapezoidViewBox): TrapezoidViewBox;
export function cartesianViewBoxToTrapezoid(
  box: CartesianViewBoxRequired | TrapezoidViewBox | undefined,
): TrapezoidViewBox | undefined {
  if (!box) {
    return undefined;
  }
  return {
    x: box.x,
    y: box.y,
    upperWidth: 'upperWidth' in box ? box.upperWidth : box.width,
    lowerWidth: 'lowerWidth' in box ? box.lowerWidth : box.width,
    width: box.width,
    height: box.height,
  };
}
export const selectChartLayout = (state: RechartsRootState): LayoutType => state.layout.layoutType;
export const selectPolarChartLayout = (state: RechartsRootState): PolarLayout | undefined => {
  const layout = state.layout.layoutType;
  if (layout === 'centric' || layout === 'radial') {
    return layout;
  }
  return undefined;
};
