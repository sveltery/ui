import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';

export interface SlotProps {
  isActive: boolean;
  char: string | null;
  placeholderChar: string | null;
  hasFakeCaret: boolean;
}

/** What the slots render from. Passed to `render` and read with `getOTPInputContext()`. */
export interface RenderProps {
  readonly slots: SlotProps[];
  readonly isFocused: boolean;
  readonly isHovering: boolean;
}

export interface OTPInputProps extends Omit<HTMLInputAttributes, 'value' | 'maxlength' | 'pattern' | 'placeholder' | 'children'> {
  /** The code. Bindable. Starts from `defaultValue` when not set. */
  value?: string;
  /** The number of slots. */
  maxLength: number;
  textAlign?: 'left' | 'center' | 'right';
  /** Every value must match it, for example `REGEXP_ONLY_DIGITS`. Input that doesn't match is dropped. */
  pattern?: string | RegExp;
  /** Characters shown in the empty slots, one per slot, through `SlotProps.placeholderChar`. */
  placeholder?: string;
  /** Called with the value when the last slot fills. */
  onComplete?: (value: string) => void;
  /** Widens the hidden input so a password manager's badge sits outside the slots. Defaults to `increase-width`. */
  pushPasswordManagerStrategy?: 'increase-width' | 'none';
  /** Rewrites pasted text before it is inserted. */
  pasteTransformer?: (pasted: string) => string;
  /** Class for the container that holds the slots and the hidden input. */
  containerClass?: HTMLAttributes<HTMLDivElement>['class'];
  /** CSS that shows the plain input when JavaScript is off. `null` leaves it out. */
  noScriptCSSFallback?: string | null;
  /** The hidden input. Bindable. */
  ref?: HTMLInputElement | null;
  /** Renders the slots from the render props. Without it, `children` renders and reads them with `getOTPInputContext()`. */
  render?: Snippet<[RenderProps]>;
  children?: Snippet;
}
