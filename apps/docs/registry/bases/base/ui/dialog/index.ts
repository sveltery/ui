import { Dialog as Primitive } from '@sveltery/base/dialog';

export const Dialog = Primitive.Root as typeof Primitive.Root;
export { default as DialogTrigger } from './DialogTrigger.svelte';
export { default as DialogPortal } from './DialogPortal.svelte';
export { default as DialogClose } from './DialogClose.svelte';
export { default as DialogOverlay } from './DialogOverlay.svelte';
export { default as DialogContent } from './DialogContent.svelte';
export { default as DialogHeader } from './DialogHeader.svelte';
export { default as DialogFooter } from './DialogFooter.svelte';
export { default as DialogTitle } from './DialogTitle.svelte';
export { default as DialogDescription } from './DialogDescription.svelte';
