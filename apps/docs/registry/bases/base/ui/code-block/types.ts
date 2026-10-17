import type { HTMLAttributes } from 'svelte/elements';
import type { ButtonProps } from '../button/index.js';
import type { CodeBlockLineVariants, CodeBlockVariants } from './variants.js';

type NativeDivProps = HTMLAttributes<HTMLDivElement>;

export type CodeBlockProps = NativeDivProps & CodeBlockVariants & { size?: 'default' | 'sm' };
export type CodeBlockHeaderProps = NativeDivProps;
export type CodeBlockTitleProps = NativeDivProps;
export type CodeBlockActionsProps = NativeDivProps;
export type CodeBlockFooterProps = NativeDivProps;
export type CodeBlockCopyButtonProps = ButtonProps & { value: string };
export type CodeBlockContentProps = HTMLAttributes<HTMLPreElement> & {
  /** Plain text to show. It renders as one text node, or as one line per row with `lineNumbers`. */
  code?: string;
  wrap?: boolean;
  lineNumbers?: boolean;
  startLine?: number;
};
export type CodeBlockLineProps = HTMLAttributes<HTMLSpanElement> & CodeBlockLineVariants;
