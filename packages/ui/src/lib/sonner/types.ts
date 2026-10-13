import type { ComponentProps } from 'svelte';
import type { Toast, ToastNode } from '@sveltery/base/toast';

export type { ToastNode };

export type ToasterProps = Omit<ComponentProps<typeof Toast.Viewport>, 'children'> & {
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
}

export type PromiseMessage = string | { message: ToastNode; description?: ToastNode };

export interface PromiseData<Value> {
  loading: string;
  success: PromiseMessage | ((value: Value) => PromiseMessage);
  error: PromiseMessage | ((error: unknown) => PromiseMessage);
  /** Shown under the title in every state that does not set its own description. */
  description?: ToastNode;
}
