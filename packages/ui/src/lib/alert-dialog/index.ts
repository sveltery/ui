import { AlertDialog as Primitive } from '@sveltery/base/alert-dialog';

export const AlertDialog = Primitive.Root as typeof Primitive.Root;
export { default as AlertDialogTrigger } from './AlertDialogTrigger.svelte';
export { default as AlertDialogPortal } from './AlertDialogPortal.svelte';
export { default as AlertDialogOverlay } from './AlertDialogOverlay.svelte';
export { default as AlertDialogContent } from './AlertDialogContent.svelte';
export { default as AlertDialogHeader } from './AlertDialogHeader.svelte';
export { default as AlertDialogFooter } from './AlertDialogFooter.svelte';
export { default as AlertDialogMedia } from './AlertDialogMedia.svelte';
export { default as AlertDialogTitle } from './AlertDialogTitle.svelte';
export { default as AlertDialogDescription } from './AlertDialogDescription.svelte';
export { default as AlertDialogAction } from './AlertDialogAction.svelte';
export { default as AlertDialogCancel } from './AlertDialogCancel.svelte';
