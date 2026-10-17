import { site } from '$lib/site';
import type { NavSection } from './types';

/** Upstream's `replaceComponentsList`: `<ComponentsList />` becomes a markdown list of every component page. */
export function replaceComponentsList(markdown: string, nav: NavSection[]) {
  const components = nav.find((section) => section.title === 'Components')?.pages ?? [];
  const list = components.map((component) => `- [${component.title}](${site.url}${component.href}): ${component.description}`).join('\n');
  return markdown.replace(/<ComponentsList\s*\/>/g, list);
}
