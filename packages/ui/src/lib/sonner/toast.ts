import { Toast } from '@sveltery/base/toast';
import type { PromiseData, PromiseMessage, ToastNode, ToastOptions } from './types.js';

export const toastManager = Toast.createToastManager();

function show(type: string | undefined, message: ToastNode, { id, description, duration, action }: ToastOptions = {}) {
  let toastId = '';
  toastId = toastManager.add({
    id,
    title: message,
    description,
    type,
    ...(duration !== undefined && { timeout: duration === Infinity ? 0 : duration }),
    ...(action && {
      actionProps: {
        children: action.label,
        onclick(event) {
          action.onClick?.(event);
          if (!event.defaultPrevented) toastManager.close(toastId);
        }
      }
    })
  });
  return toastId;
}

function toToast(message: PromiseMessage, description: ToastNode | undefined) {
  return typeof message === 'string'
    ? { title: message, description }
    : { title: message.message, description: message.description ?? description };
}

function promise<Value>(value: Promise<Value>, data: PromiseData<Value>) {
  const settled = toastManager.promise(value, {
    loading: toToast(data.loading, data.description),
    success: result => toToast(typeof data.success === 'function' ? data.success(result) : data.success, data.description),
    error: error => toToast(typeof data.error === 'function' ? data.error(error) : data.error, data.description)
  });
  settled.catch(() => {});
  return { unwrap: () => settled };
}

export const toast = Object.assign((message: ToastNode, options?: ToastOptions) => show(undefined, message, options), {
  message: (message: ToastNode, options?: ToastOptions) => show(undefined, message, options),
  success: (message: ToastNode, options?: ToastOptions) => show('success', message, options),
  info: (message: ToastNode, options?: ToastOptions) => show('info', message, options),
  warning: (message: ToastNode, options?: ToastOptions) => show('warning', message, options),
  error: (message: ToastNode, options?: ToastOptions) => show('error', message, options),
  loading: (message: ToastNode, options?: ToastOptions) => show('loading', message, options),
  promise,
  /** Closes the toast with this id, or every toast without one. */
  dismiss: (id?: string) => toastManager.close(id)
});
