import * as React from '../react.js';
import { EasingInput } from './easing.js';
import { AnimationManager } from './AnimationManager.js';
export type JavascriptAnimateProps = {
  animationId: string;
  animationManager?: AnimationManager;
  duration?: number;
  begin?: number;
  easing?: EasingInput;
  isActive?: boolean | 'auto';
  canBegin?: boolean;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  children: (time: number) => React.ReactNode;
};
export const defaultJavascriptAnimateProps = {
  begin: 0,
  duration: 1000,
  easing: 'ease',
  isActive: true,
  canBegin: true,
  onAnimationEnd: () => {},
  onAnimationStart: () => {},
} as const satisfies Partial<JavascriptAnimateProps>;
type TimeAsObject = {
  t: number;
};
