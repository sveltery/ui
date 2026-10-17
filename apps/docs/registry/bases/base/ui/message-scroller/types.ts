import type {
  MessageScrollerButtonProps as BaseButtonProps,
  MessageScrollerContentProps,
  MessageScrollerItemProps,
  MessageScrollerRootProps,
  MessageScrollerViewportProps
} from '@sveltery/svelte/message-scroller';
import type { ButtonVariants } from '../button/index.js';

export type MessageScrollerProps = MessageScrollerRootProps;
export type MessageScrollerButtonProps = BaseButtonProps & ButtonVariants;
export type { MessageScrollerContentProps, MessageScrollerItemProps, MessageScrollerViewportProps };
export type {
  MessageScrollerButtonDirection,
  MessageScrollerDefaultScrollPosition,
  MessageScrollerProviderProps,
  MessageScrollerScrollable,
  MessageScrollerScrollAlign,
  MessageScrollerScrollOptions,
  MessageScrollerVisibilityState
} from '@sveltery/svelte/message-scroller';
