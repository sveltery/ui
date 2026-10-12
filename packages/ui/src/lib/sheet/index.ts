import { Dialog as Primitive } from '@sveltery/base/dialog';

export const Sheet = Primitive.Root;
export { default as SheetTrigger } from './SheetTrigger.svelte';
export { default as SheetPortal } from './SheetPortal.svelte';
export { default as SheetClose } from './SheetClose.svelte';
export { default as SheetOverlay } from './SheetOverlay.svelte';
export { default as SheetContent } from './SheetContent.svelte';
export { default as SheetHeader } from './SheetHeader.svelte';
export { default as SheetFooter } from './SheetFooter.svelte';
export { default as SheetTitle } from './SheetTitle.svelte';
export { default as SheetDescription } from './SheetDescription.svelte';
export type { SheetContentProps, SheetSide } from './types.js';
