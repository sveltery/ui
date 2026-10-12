import type { HTMLAttributes } from 'svelte/elements';
import type { ButtonProps } from '../button/index.js';
import type { RenderSnippet } from '../shared/render.js';
import type { AttachmentMediaVariants, AttachmentVariants } from './variants.js';

type NativeDivProps = HTMLAttributes<HTMLDivElement>;
type NativeSpanProps = HTMLAttributes<HTMLSpanElement>;

export type AttachmentStatus = 'idle' | 'uploading' | 'processing' | 'error' | 'done';
export type AttachmentProps = NativeDivProps & AttachmentVariants & { state?: AttachmentStatus };
export type AttachmentGroupProps = NativeDivProps;
export type AttachmentMediaProps = NativeDivProps & AttachmentMediaVariants;
export type AttachmentContentProps = NativeDivProps;
export type AttachmentTitleProps = NativeSpanProps;
export type AttachmentDescriptionProps = NativeSpanProps;
export type AttachmentActionsProps = NativeDivProps;
export type AttachmentActionProps = ButtonProps;
export type AttachmentTriggerState = { slot: 'attachment-trigger' };
export type AttachmentTriggerProps = HTMLAttributes<HTMLElement> & {
  type?: 'button' | 'submit' | 'reset' | null;
  render?: RenderSnippet<AttachmentTriggerState>;
};
