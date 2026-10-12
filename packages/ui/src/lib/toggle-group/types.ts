import type { ToggleGroupProps as BaseToggleGroupProps } from '@sveltery/base/toggle-group';
import type { ToggleProps } from '../toggle/index.js';
import type { ToggleVariants } from '../toggle/index.js';
export type ToggleGroupProps = BaseToggleGroupProps & ToggleVariants & { spacing?: number };
export type ToggleGroupItemProps = ToggleProps;
export type { ToggleGroupState } from '@sveltery/base/toggle-group';
