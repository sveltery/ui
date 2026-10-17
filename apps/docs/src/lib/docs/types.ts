import type { Component } from 'svelte';
import type { TocItem } from '../../../markdown/headings';
import type { StyleName } from '../../../registry/types';

export type { TocItem };

/**
 * Frontmatter every page in `content/docs` declares, plus the `toc` the markdown pipeline adds. `style` renders the
 * page in a style other than nova, as upstream does for pages such as Drawer.
 */
export type Frontmatter = { title: string; description: string; order?: number; style?: StyleName; toc: TocItem[] };

export type DocModule = { default: Component; metadata: Frontmatter };

export type DocPage = { href: string; title: string; description: string };

export type NavSection = { title: string; href?: string; pages: DocPage[] };
