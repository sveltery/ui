import type { Layout } from './layout.js';
import type { LayoutChangeDetails } from './types.js';

type LayoutStorage = Pick<Storage, 'getItem' | 'setItem'>;

export interface SavedLayout {
  id: string;
  defaultLayout: Layout | undefined;
  onLayoutChanged: (layout: Layout, details?: LayoutChangeDetails) => void;
}

function read(storage: LayoutStorage | undefined, key: string): Layout | undefined {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(key) ?? 'null');
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return undefined;
    const entries = Object.entries(parsed);
    return entries.every(([, size]) => typeof size === 'number' && Number.isFinite(size)) ? (parsed as Layout) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Saves a group's layout in storage and restores it on the next visit. Spread the result on the group:
 * `<Group {...savedLayout({ id: 'editor' })}>`. Storage defaults to `localStorage`, and a missing or
 * blocked storage leaves the group on its default layout.
 */
export function savedLayout({ id, storage }: { id: string; storage?: LayoutStorage }): SavedLayout {
  const key = `sveltery-resizable:${id}`;
  const target = storage ?? (typeof localStorage === 'undefined' ? undefined : localStorage);
  return {
    id,
    defaultLayout: read(target, key),
    onLayoutChanged: (layout) => {
      try {
        target?.setItem(key, JSON.stringify(layout));
      } catch {
        // Storage can be full or blocked. The layout still works for this visit.
      }
    }
  };
}
