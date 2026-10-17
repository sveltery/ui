import { SVGProps } from '../../react.js';
import { BasePolarGraphicalItemSettings } from '../graphicalItemsSlice.js';
import { DataKey, LegendType } from '../../util/types.js';
import { TooltipType } from '../../component/DefaultTooltipContent.js';
import { SVGPropsNoEvents } from '../../util/svgPropertiesNoEvents.js';
import { WithoutId } from '../../util/useUniqueId.js';

export type PiePresentationProps = SVGPropsNoEvents<WithoutId<SVGProps<SVGPathElement>>>;

export interface PieSettings extends BasePolarGraphicalItemSettings {
  type: 'pie';
  name: string | number | undefined;
  nameKey: DataKey<any>;
  tooltipType: TooltipType | undefined;

  legendType: LegendType;
  fill: string;

  cx: number | string;
  cy: number | string;
  startAngle: number;
  endAngle: number;
  paddingAngle: number;
  minAngle: number;
  innerRadius: number | string;
  outerRadius: number | string | ((element: any) => number | string);
  maxRadius: number | undefined;
  cornerRadius: number | string | undefined;
  presentationProps: PiePresentationProps | null;
}
