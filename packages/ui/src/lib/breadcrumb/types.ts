import type { HTMLAnchorAttributes, HTMLAttributes, HTMLLiAttributes, HTMLOlAttributes } from 'svelte/elements';
import type { RenderSnippet } from '../shared/render.js';

export type BreadcrumbProps = HTMLAttributes<HTMLElement>;
export type BreadcrumbListProps = HTMLOlAttributes;
export type BreadcrumbItemProps = HTMLLiAttributes;
export type BreadcrumbLinkState = { slot: 'breadcrumb-link' };
export type BreadcrumbLinkProps = HTMLAnchorAttributes & { render?: RenderSnippet<BreadcrumbLinkState, HTMLAnchorElement> };
export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;
export type BreadcrumbSeparatorProps = HTMLLiAttributes;
export type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement>;
