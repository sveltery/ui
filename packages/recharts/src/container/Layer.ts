import { ReactNode, SVGAttributes } from '../react.js';
interface LayerProps {
  className?: string;
  children?: ReactNode;
}
export type Props = SVGAttributes<SVGGElement> & LayerProps;
