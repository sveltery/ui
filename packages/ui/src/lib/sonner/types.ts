import type { ComponentProps, Snippet } from 'svelte';
import type { Toast, ToastNode } from '@sveltery/base/toast';

export type { ToastNode };

export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/** Extra classes for the parts of a toast. Each value merges after the default classes. */
export interface ToastClassNames {
  toast?: string;
  content?: string;
  icon?: string;
  title?: string;
  description?: string;
  actionButton?: string;
  closeButton?: string;
}

/** The body of a custom toast. Receives the toast's id, for `toast.dismiss(id)`. */
export type CustomToast = Snippet<[id: string]>;

/** What `Toaster` reads from a toast's `data`. */
export interface ToastData {
  className?: string;
  classNames?: ToastClassNames;
  closeButton?: boolean;
  richColors?: boolean;
  custom?: CustomToast;
}

export type ToasterProps = Omit<ComponentProps<typeof Toast.Viewport>, 'children'> & {
  /** Where the toasts appear. */
  position?: ToastPosition;
  /** Tint success, info, warning and error toasts. */
  richColors?: boolean;
  /** Show a close button on every toast. A toast's own `closeButton` overrides it. */
  closeButton?: boolean;
  /** The accessible name of the close button. */
  closeButtonAriaLabel?: string;
  /** Extra classes for the parts of every toast. */
  classNames?: ToastClassNames;
  /** Milliseconds before a toast closes itself. `0` keeps toasts open. */
  timeout?: number;
  /** How many toasts show at once. */
  limit?: number;
};

export interface ToastAction {
  label: ToastNode;
  /** Runs on click. The toast closes afterwards unless the handler calls `event.preventDefault()`. */
  onClick?: (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => void;
}

export interface ToastOptions {
  /** Reuse an id to update that toast in place. */
  id?: string;
  description?: ToastNode;
  /** Milliseconds before the toast closes itself. `Infinity` keeps it open. */
  duration?: number;
  action?: ToastAction;
  /** Extra classes for this toast's root. */
  className?: string;
  /** Extra classes for the parts of this toast. */
  classNames?: ToastClassNames;
  /** Overrides the `Toaster` setting for this toast. */
  closeButton?: boolean;
  /** Overrides the `Toaster` setting for this toast. */
  richColors?: boolean;
}

export type CustomToastOptions = Pick<ToastOptions, 'id' | 'duration' | 'className'>;

export type PromiseMessage = string | { message: ToastNode; description?: ToastNode };

export interface PromiseData<Value> {
  loading: string;
  success: PromiseMessage | ((value: Value) => PromiseMessage);
  error: PromiseMessage | ((error: unknown) => PromiseMessage);
  /** Shown under the title in every state that does not set its own description. */
  description?: ToastNode;
}
