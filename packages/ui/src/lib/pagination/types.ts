import type { HTMLAnchorAttributes, HTMLAttributes, HTMLLiAttributes } from 'svelte/elements';
import type { ButtonVariants } from '../button/index.js';

export type PaginationProps = HTMLAttributes<HTMLElement>;
export type PaginationContentProps = HTMLAttributes<HTMLUListElement>;
export type PaginationItemProps = HTMLLiAttributes;
export type PaginationLinkProps = HTMLAnchorAttributes & { isActive?: boolean; size?: ButtonVariants['size'] };
export type PaginationPreviousProps = Omit<PaginationLinkProps, 'children'> & { text?: string };
export type PaginationNextProps = Omit<PaginationLinkProps, 'children'> & { text?: string };
export type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement>;
