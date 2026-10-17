import { ReactNode, CSSProperties, SVGProps } from '../react.js';
import { CartesianViewBox } from '../util/types.js';
interface SurfaceProps {
  width: number | string;
  height: number | string;
  viewBox?: CartesianViewBox;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  title?: string;
  desc?: string;
}
export type Props = Omit<SVGProps<SVGSVGElement>, 'viewBox'> & SurfaceProps;
