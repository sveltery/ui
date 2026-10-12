import type { ComponentProps } from 'svelte';
import type { Dialog as Primitive } from '@sveltery/base/dialog';
export type SheetSide = 'top' | 'right' | 'bottom' | 'left';
export type SheetContentProps = ComponentProps<typeof Primitive.Popup> & { side?: SheetSide; showCloseButton?: boolean };
