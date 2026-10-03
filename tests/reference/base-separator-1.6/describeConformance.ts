// Local renderer types only; raw upstream describeConformance.tsx is retained separately.
import type { ReactElement, ReactNode, Ref, CSSProperties } from 'react';
export type ConformantComponentProps = {
  render?: ReactElement<unknown> | ((props: Record<string, unknown>) => ReactNode);
  ref?: Ref<unknown>;
  'data-testid'?: string;
  className?: string | ((state: unknown) => string);
  style?: CSSProperties;
  nativeButton?: boolean;
};
export interface BaseUiConformanceTestsOptions {
  render: (element: ReactElement<ConformantComponentProps>) => Promise<{ container: HTMLElement }>;
  refInstanceof?: typeof HTMLElement;
  testRenderPropWith?: keyof React.JSX.IntrinsicElements;
  button?: boolean;
  wrappingAllowed?: boolean;
}
