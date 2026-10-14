import type { ToastPosition } from '@sveltery/ui/sonner';

/** The docs layout mounts the only Toaster and reads its position from here. */
export const sonnerPosition = $state<{ value: ToastPosition }>({ value: 'bottom-right' });
