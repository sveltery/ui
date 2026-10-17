export { default as CodeBlock } from './CodeBlock.svelte';
export { default as CodeBlockHeader } from './CodeBlockHeader.svelte';
export { default as CodeBlockTitle } from './CodeBlockTitle.svelte';
export { default as CodeBlockActions } from './CodeBlockActions.svelte';
export { default as CodeBlockCopyButton } from './CodeBlockCopyButton.svelte';
export { default as CodeBlockContent } from './CodeBlockContent.svelte';
export { default as CodeBlockLine } from './CodeBlockLine.svelte';
export { default as CodeBlockFooter } from './CodeBlockFooter.svelte';
export { codeBlockVariants, codeBlockLineVariants } from './variants.js';
export type { CodeBlockVariants, CodeBlockLineVariants } from './variants.js';
export { highlightCode, loadHighlighter } from './highlighter.js';
export { useHighlightedCode } from './use-highlighted-code.svelte.js';
export type {
  CodeBlockProps,
  CodeBlockHeaderProps,
  CodeBlockTitleProps,
  CodeBlockActionsProps,
  CodeBlockCopyButtonProps,
  CodeBlockContentProps,
  CodeBlockLineProps,
  CodeBlockFooterProps,
} from './types.js';
