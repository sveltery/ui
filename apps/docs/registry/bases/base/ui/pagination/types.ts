import type { HTMLAnchorAttributes, HTMLAttributes, HTMLLiAttributes } from 'svelte/elements';
import type { ButtonProps } from '../button/index.js';

export type PaginationProps = HTMLAttributes<HTMLElement>;
export type PaginationContentProps = HTMLAttributes<HTMLUListElement>;
export type PaginationItemProps = HTMLLiAttributes;
// Base's Button types its own props for a native button. The link attributes come from the anchor.
export type PaginationLinkProps = Omit<ButtonProps, 'variant' | 'nativeButton' | 'render'> & Pick<HTMLAnchorAttributes, 'href' | 'hreflang' | 'target' | 'rel' | 'download'> & { isActive?: boolean };
export type PaginationPreviousProps = Omit<PaginationLinkProps, 'children'> & { text?: string };
export type PaginationNextProps = Omit<PaginationLinkProps, 'children'> & { text?: string };
export type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement>;
