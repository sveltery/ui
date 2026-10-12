import { clsx, type ClassValue } from 'clsx';
import type { IconLibraryName } from './config.js';
import type { IconData, IconNode } from './data.js';
export type IconAttributes = Record<string, unknown> & { class?: ClassValue; color?: string | null; stroke?: string | null; title?: string | null; width?: string | number | null; height?: string | number | null };
const mergeLucideClasses = (...classes: string[]) => classes.filter((value, index, array) => value && value.trim() !== '' && array.indexOf(value) === index).join(' ').trim();
export function iconAttributes(data: IconData, library: IconLibraryName | 'fallback', props: IconAttributes) {
  const { class: className, color, title, ...rest } = props;
  delete rest.strokeWidth;
  const base: Record<string, unknown> = { ...data.attributes };
  const consumerClass = clsx(className);
  if (library === 'lucide' || library === 'fallback') { base.class = mergeLucideClasses('lucide', mergeLucideClasses(String(base.class).replace(/^lucide /, ''), consumerClass)); if (color !== undefined) base.stroke = color; }
  if (library === 'tabler') { base.class = `${base.class}${consumerClass}`; if (color !== undefined) base.stroke = color; if (rest.stroke !== undefined) base['stroke-width'] = rest.stroke; delete rest.stroke; }
  if (library === 'hugeicons') { base.class = className === null ? null : consumerClass; if (color !== undefined) base.color = color; }
  if (library === 'phosphor') { if (className !== undefined) base.class = className === null ? null : consumerClass; if (color != null) base.fill = color; }
  if (library === 'remixicon') { base.class = `remixicon ${consumerClass}`; if (color !== undefined) base.fill = color; }
  if (library !== 'tabler' && title !== undefined) rest.title = title;
  // create-icon-loader consumes strokeWidth. Its Hugeicons branch forces 2;
  // only the unsuspended Square fallback receives the caller strokeWidth.
  if (library === 'fallback' && props.strokeWidth !== undefined) rest['stroke-width'] = props.strokeWidth;
  return { ...base, ...rest };
}
export function iconNodes(data: IconData, library: IconLibraryName | 'fallback'): IconNode[] {
  if (library !== 'hugeicons') return data.nodes;
  return [...data.nodes].sort((a, b) => Number(a.attributes.opacity !== undefined) - Number(b.attributes.opacity !== undefined)).map(node => ({ ...node, attributes: { ...node.attributes, 'stroke-width': 2, stroke: 'currentColor' } }));
}
